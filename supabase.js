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
    // Load all habits for the user
    static async loadHabits() {
        const user = await AuthService.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        try {
            const { data, error } = await supabaseClient
                .from('habits')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Parse JSON fields
            const habits = (data || []).map(habit => ({
                ...habit,
                days: JSON.parse(habit.days || '[]'),
                completions: JSON.parse(habit.completions || '{}')
            }));

            return { success: true, data: habits };
        } catch (error) {
            console.error('Load habits error:', error);
            return { success: false, error: error.message };
        }
    }

    // Save a new or updated habit
    static async saveHabit(habit) {
        const user = await AuthService.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        try {
            const habitData = {
                user_id: user.id,
                id: habit.id,
                name: habit.name,
                action: habit.action,
                time_location: habit.timeLocation,
                identity: habit.identity,
                days: JSON.stringify(habit.days),
                goal_amount: habit.goalAmount,
                goal_unit: habit.goalUnit,
                habit_time: habit.habitTime,
                send_reminder: habit.sendReminder,
                completions: JSON.stringify(habit.completions || {}),
                created_at: habit.createdAt || new Date().toISOString()
            };

            const { error } = await supabaseClient
                .from('habits')
                .upsert(habitData, {
                    onConflict: 'user_id,id'
                });

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Save habit error:', error);
            return { success: false, error: error.message };
        }
    }

    // Toggle a completion for a habit
    static async toggleCompletion(habitId, date, completed) {
        const user = await AuthService.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        try {
            // Load the habit
            const { data: habitData, error: loadError } = await supabaseClient
                .from('habits')
                .select('completions')
                .eq('user_id', user.id)
                .eq('id', habitId)
                .single();

            if (loadError) throw loadError;

            // Update completions
            const completions = JSON.parse(habitData.completions || '{}');
            if (completed) {
                completions[date] = true;
            } else {
                delete completions[date];
            }

            // Save back
            const { error: updateError } = await supabaseClient
                .from('habits')
                .update({ completions: JSON.stringify(completions) })
                .eq('user_id', user.id)
                .eq('id', habitId);

            if (updateError) throw updateError;

            return { success: true };
        } catch (error) {
            console.error('Toggle completion error:', error);
            return { success: false, error: error.message };
        }
    }
}

