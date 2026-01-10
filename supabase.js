// ============================================================================
// SUPABASE CONFIGURATION & AUTHENTICATION
// ============================================================================

const SUPABASE_URL = 'https://umnzhtbbvseiwldkoeoq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbnpodGJidnNlaXdsZGtvZW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NjU4NzMsImV4cCI6MjA4MzU0MTg3M30.B17TiqgTEOGJm6YiuldfzXbNGvJ0X4dB1m6cZvy5OPU';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

class AuthService {
    static async signUp(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin
                }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    static async signIn(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    static async signOut() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    static async getSession() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        return session;
    }

    static async getUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    }

    static onAuthStateChange(callback) {
        return supabaseClient.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
}

// ============================================================================
// DATABASE SERVICE
// ============================================================================

class DatabaseService {
    // Sync completions to Supabase
    static async syncCompletions(completions) {
        const user = await AuthService.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        try {
            // Convert completions object to array of records
            const records = [];
            for (const [date, habits] of Object.entries(completions)) {
                for (const [habitId, completed] of Object.entries(habits)) {
                    if (completed) {
                        records.push({
                            user_id: user.id,
                            habit_id: habitId,
                            date: date,
                            completed: true
                        });
                    }
                }
            }

            // Upsert all records
            if (records.length > 0) {
                const { error } = await supabaseClient
                    .from('completions')
                    .upsert(records, {
                        onConflict: 'user_id,habit_id,date',
                        ignoreDuplicates: false
                    });

                if (error) throw error;
            }

            return { success: true };
        } catch (error) {
            console.error('Sync error:', error);
            return { success: false, error: error.message };
        }
    }

    // Load completions from Supabase
    static async loadCompletions() {
        const user = await AuthService.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        try {
            const { data, error } = await supabaseClient
                .from('completions')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;

            // Convert array of records back to completions object
            const completions = {};
            data.forEach(record => {
                if (!completions[record.date]) {
                    completions[record.date] = {};
                }
                completions[record.date][record.habit_id] = record.completed;
            });

            return { success: true, data: completions };
        } catch (error) {
            console.error('Load error:', error);
            return { success: false, error: error.message };
        }
    }

    // Toggle a single completion
    static async toggleCompletion(habitId, date, completed) {
        const user = await AuthService.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        try {
            if (completed) {
                // Insert or update
                const { error } = await supabaseClient
                    .from('completions')
                    .upsert({
                        user_id: user.id,
                        habit_id: habitId,
                        date: date,
                        completed: true
                    }, {
                        onConflict: 'user_id,habit_id,date'
                    });

                if (error) throw error;
            } else {
                // Delete
                const { error } = await supabaseClient
                    .from('completions')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('habit_id', habitId)
                    .eq('date', date);

                if (error) throw error;
            }

            return { success: true };
        } catch (error) {
            console.error('Toggle error:', error);
            return { success: false, error: error.message };
        }
    }
}

// ============================================================================
// OFFLINE-FIRST SYNC MANAGER
// ============================================================================

class SyncManager {
    static pendingChanges = [];
    static isOnline = navigator.onLine;
    static isSyncing = false;

    static init() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processPendingChanges();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });

        // Sync on visibility change (user returns to tab)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isOnline) {
                this.processPendingChanges();
            }
        });
    }

    static async queueChange(habitId, date, completed) {
        // Add to pending changes
        this.pendingChanges.push({ habitId, date, completed, timestamp: Date.now() });

        // Try to sync immediately if online
        if (this.isOnline) {
            await this.processPendingChanges();
        }
    }

    static async processPendingChanges() {
        if (this.isSyncing || this.pendingChanges.length === 0) return;

        this.isSyncing = true;

        try {
            // Process each pending change
            while (this.pendingChanges.length > 0) {
                const change = this.pendingChanges[0];
                const result = await DatabaseService.toggleCompletion(
                    change.habitId,
                    change.date,
                    change.completed
                );

                if (result.success) {
                    // Remove from queue if successful
                    this.pendingChanges.shift();
                } else {
                    // Stop processing if we hit an error
                    console.error('Failed to sync change:', result.error);
                    break;
                }
            }
        } finally {
            this.isSyncing = false;
        }
    }

    static getPendingCount() {
        return this.pendingChanges.length;
    }
}

// Initialize sync manager
SyncManager.init();
