// ============================================================================
// ATOMS HABIT TRACKER - MAIN APPLICATION
// ============================================================================

class AtomsApp {
    constructor() {
        this.user = null;
        this.habits = [];
        this.selectedDate = new Date();
        this.isCompactView = false;
        this.habitFormData = {};

        this.init();
    }

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    async init() {
        this.attachAuthListeners();
        await this.initializeAuth();
    }

    async initializeAuth() {
        const session = await AuthService.getSession();

        if (session) {
            this.user = session.user;
            await this.onAuthSuccess();
        }

        AuthService.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.user = session.user;
                await this.onAuthSuccess();
            } else if (event === 'SIGNED_OUT') {
                this.onSignOut();
            }
        });
    }

    async onAuthSuccess() {
        document.getElementById('auth-modal').classList.remove('active');
        document.getElementById('app').style.display = 'block';

        // Attach app event listeners after app is visible
        this.attachAppListeners();

        await this.loadHabits();
        this.renderWeekNavigation();
        this.renderHabits();
    }

    onSignOut() {
        this.user = null;
        this.habits = [];
        document.getElementById('app').style.display = 'none';
        document.getElementById('auth-modal').classList.add('active');
    }

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================

    attachAuthListeners() {
        // Auth buttons - visible on auth modal
        document.getElementById('signin-btn').addEventListener('click', () => this.handleSignIn());
        document.getElementById('signup-btn').addEventListener('click', () => this.handleSignUp());
    }

    attachAppListeners() {
        // Add Habit
        document.getElementById('add-habit-btn').addEventListener('click', () => this.openCreateHabitModal());

        // Compact View Toggle
        document.getElementById('compact-view-toggle').addEventListener('change', (e) => {
            this.isCompactView = e.target.checked;
            this.renderHabits();
        });

        // Create Habit - Step 1
        document.getElementById('continue-to-settings-btn').addEventListener('click', () => this.continueToSettings());

        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('habit-name').value = btn.textContent;
            });
        });

        // Create Habit - Step 2
        document.getElementById('create-habit-btn').addEventListener('click', () => this.createHabit());

        // Day selector
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', () => btn.classList.toggle('selected'));
        });

        // Modal close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            });
        });

        document.querySelector('.back-btn').addEventListener('click', () => {
            document.getElementById('habit-settings-modal').classList.remove('active');
            document.getElementById('create-habit-modal').classList.add('active');
        });

        // Bottom nav
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // For now, only Home view is functional
            });
        });
    }

    // ========================================================================
    // AUTHENTICATION
    // ========================================================================

    async handleSignIn() {
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        const errorEl = document.getElementById('auth-error');
        const successEl = document.getElementById('auth-success');

        errorEl.style.display = 'none';
        successEl.style.display = 'none';

        if (!email || !password) {
            errorEl.textContent = 'Please enter email and password';
            errorEl.style.display = 'block';
            return;
        }

        const result = await AuthService.signIn(email, password);

        if (!result.success) {
            errorEl.textContent = result.error;
            errorEl.style.display = 'block';
        }
    }

    async handleSignUp() {
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        const errorEl = document.getElementById('auth-error');
        const successEl = document.getElementById('auth-success');

        errorEl.style.display = 'none';
        successEl.style.display = 'none';

        if (!email || !password) {
            errorEl.textContent = 'Please enter email and password';
            errorEl.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            errorEl.textContent = 'Password must be at least 6 characters';
            errorEl.style.display = 'block';
            return;
        }

        const result = await AuthService.signUp(email, password);

        if (result.success) {
            successEl.textContent = 'Account created! You can now sign in.';
            successEl.style.display = 'block';
        } else {
            errorEl.textContent = result.error;
            errorEl.style.display = 'block';
        }
    }

    // ========================================================================
    // HABITS DATA
    // ========================================================================

    async loadHabits() {
        const result = await DatabaseService.loadHabits();

        if (result.success) {
            this.habits = result.data || [];
        } else {
            console.error('Failed to load habits:', result.error);
            this.habits = [];
        }
    }

    async saveHabit(habit) {
        const result = await DatabaseService.saveHabit(habit);

        if (result.success) {
            await this.loadHabits();
            this.renderHabits();
        } else {
            console.error('Failed to save habit:', result.error);
        }
    }

    async toggleHabitCompletion(habitId, date) {
        const dateStr = this.formatDate(date);
        const habit = this.habits.find(h => h.id === habitId);

        if (!habit) return;

        if (!habit.completions) habit.completions = {};
        const isCompleted = !habit.completions[dateStr];
        habit.completions[dateStr] = isCompleted;

        const result = await DatabaseService.toggleCompletion(habitId, dateStr, isCompleted);

        if (result.success) {
            this.renderHabits();
        } else {
            console.error('Failed to toggle completion:', result.error);
            habit.completions[dateStr] = !isCompleted;
        }
    }

    // ========================================================================
    // WEEK NAVIGATION
    // ========================================================================

    renderWeekNavigation() {
        const weekNav = document.getElementById('week-nav');
        weekNav.innerHTML = '';

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);

            const dayItem = document.createElement('div');
            dayItem.className = 'day-item';

            if (this.isSameDay(day, today)) {
                dayItem.classList.add('today');
            }

            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Today'];
            const dayName = this.isSameDay(day, today) ? 'Today' : dayNames[day.getDay()];

            dayItem.innerHTML = `
                <span class="day-name">${dayName}</span>
                <span class="day-number">${String(day.getDate()).padStart(2, '0')}</span>
            `;

            dayItem.addEventListener('click', () => {
                this.selectedDate = day;
                this.renderWeekNavigation();
                this.renderHabits();
            });

            weekNav.appendChild(dayItem);
        }
    }

    // ========================================================================
    // RENDER HABITS
    // ========================================================================

    renderHabits() {
        const container = document.getElementById('habits-container');
        container.className = 'habits-container';

        if (this.isCompactView) {
            container.classList.add('compact');
        }

        if (this.habits.length === 0) {
            this.renderOnboardingPebble(container);
            return;
        }

        container.innerHTML = '';

        this.habits.forEach(habit => {
            const pebble = this.createHabitPebble(habit);
            container.appendChild(pebble);
        });
    }

    renderOnboardingPebble(container) {
        const onboarding = document.getElementById('onboarding-pebble');

        if (!onboarding) {
            container.innerHTML = `
                <div id="onboarding-pebble" class="onboarding-pebble">
                    <div class="onboarding-content">
                        <div class="onboarding-logo">
                            <div class="logo-icon-large"></div>
                        </div>
                        <h2>Atoms.</h2>
                        <p class="onboarding-instruction">Press and hold the habit pebble below to get started</p>

                        <div class="first-habit-pebble" id="first-pebble">
                            <div class="streak-badge">⚡<span>0</span></div>
                            <h3>I will<br>take action</h3>
                            <p class="identity-text">so that I can become<br><span>the type of person I want to be</span></p>
                        </div>

                        <p class="press-hold-text">PRESS AND HOLD TO GET STARTED</p>
                    </div>
                </div>
            `;

            const firstPebble = document.getElementById('first-pebble');
            this.attachPressAndHoldListener(firstPebble, () => {
                this.openCreateHabitModal();
            });
        } else {
            onboarding.style.display = 'block';
        }
    }

    createHabitPebble(habit) {
        const dateStr = this.formatDate(this.selectedDate);
        const isCompleted = habit.completions && habit.completions[dateStr];
        const streak = this.calculateStreak(habit);

        const pebble = document.createElement('div');
        pebble.className = 'habit-pebble';
        if (isCompleted) pebble.classList.add('completed');

        if (this.isCompactView) {
            pebble.innerHTML = `
                <div class="streak-badge">⚡<span>${streak}</span></div>
                <div class="habit-name">${habit.name}</div>
                <button class="menu-btn-small">⋯</button>
            `;
        } else {
            pebble.innerHTML = `
                <button class="menu-btn-small">⋯</button>
                <div class="streak-badge">⚡<span>${streak}</span></div>
                <div class="habit-name">${habit.name}</div>
                <div class="habit-identity">
                    <span class="habit-identity-label">I want to become</span>
                    <span class="habit-identity-value">${habit.identity || 'Better'}</span>
                </div>
                ${isCompleted ? '<button class="undo-btn">↶</button>' : ''}
            `;
        }

        // Tap to open detail
        pebble.addEventListener('click', (e) => {
            if (!e.target.classList.contains('menu-btn-small') &&
                !e.target.classList.contains('undo-btn')) {
                this.openHabitDetail(habit);
            }
        });

        // Undo button
        const undoBtn = pebble.querySelector('.undo-btn');
        if (undoBtn) {
            undoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleHabitCompletion(habit.id, this.selectedDate);
            });
        }

        // Press and hold to complete
        if (!isCompleted) {
            this.attachPressAndHoldListener(pebble, () => {
                this.toggleHabitCompletion(habit.id, this.selectedDate);
            });
        }

        return pebble;
    }

    // ========================================================================
    // PRESS AND HOLD INTERACTION
    // ========================================================================

    attachPressAndHoldListener(element, callback) {
        let pressTimer = null;
        let startY = 0;
        const holdDuration = 500;

        const startPress = (e) => {
            startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            pressTimer = setTimeout(() => {
                callback();
            }, holdDuration);
        };

        const cancelPress = (e) => {
            if (e.type === 'touchmove') {
                const currentY = e.touches[0].clientY;
                if (Math.abs(currentY - startY) > 10) {
                    clearTimeout(pressTimer);
                }
            } else {
                clearTimeout(pressTimer);
            }
        };

        element.addEventListener('mousedown', startPress);
        element.addEventListener('touchstart', startPress, { passive: true });
        element.addEventListener('mouseup', cancelPress);
        element.addEventListener('mouseleave', cancelPress);
        element.addEventListener('touchend', cancelPress);
        element.addEventListener('touchmove', cancelPress, { passive: true });
    }

    // ========================================================================
    // CREATE HABIT FLOW
    // ========================================================================

    openCreateHabitModal() {
        this.habitFormData = {};

        // Clear form
        document.getElementById('habit-action').value = '';
        document.getElementById('habit-time-location').value = '';
        document.getElementById('habit-identity').value = '';
        document.getElementById('habit-name').value = '';

        document.getElementById('create-habit-modal').classList.add('active');
    }

    continueToSettings() {
        const action = document.getElementById('habit-action').value.trim();
        const timeLocation = document.getElementById('habit-time-location').value.trim();
        const identity = document.getElementById('habit-identity').value.trim();
        const name = document.getElementById('habit-name').value.trim();

        if (!name) {
            alert('Please enter a habit name');
            return;
        }

        this.habitFormData = {
            action: action || name,
            timeLocation: timeLocation || 'daily',
            identity: identity || 'better',
            name: name
        };

        // Update settings modal display
        document.getElementById('display-action').textContent = this.habitFormData.action;
        document.getElementById('display-time-location').textContent = this.habitFormData.timeLocation;
        document.getElementById('display-identity').textContent = this.habitFormData.identity;

        // Reset day selector to all days
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.classList.add('selected');
        });

        document.getElementById('create-habit-modal').classList.remove('active');
        document.getElementById('habit-settings-modal').classList.add('active');
    }

    async createHabit() {
        const selectedDays = [];
        document.querySelectorAll('.day-btn.selected').forEach(btn => {
            selectedDays.push(parseInt(btn.dataset.day));
        });

        if (selectedDays.length === 0) {
            alert('Please select at least one day');
            return;
        }

        const habit = {
            id: 'habit_' + Date.now(),
            name: this.habitFormData.name,
            action: this.habitFormData.action,
            timeLocation: this.habitFormData.timeLocation,
            identity: this.habitFormData.identity,
            days: selectedDays,
            goalAmount: parseInt(document.getElementById('goal-amount').value) || 1,
            goalUnit: document.getElementById('goal-unit').value,
            habitTime: document.getElementById('habit-time').value,
            sendReminder: document.getElementById('send-reminder').checked,
            completions: {},
            createdAt: new Date().toISOString()
        };

        await this.saveHabit(habit);
        document.getElementById('habit-settings-modal').classList.remove('active');
    }

    // ========================================================================
    // HABIT DETAIL MODAL
    // ========================================================================

    openHabitDetail(habit) {
        const modal = document.getElementById('habit-detail-modal');
        const body = document.getElementById('habit-detail-body');

        const streak = this.calculateStreak(habit);
        const totalReps = Object.values(habit.completions || {}).filter(Boolean).length;
        const completionRate = this.calculateCompletionRate(habit);

        body.innerHTML = `
            <div class="detail-statement">
                I will <span>${habit.action}</span>, <span>${habit.timeLocation}</span>
                so that I can become <span>${habit.identity}</span>
            </div>

            <div class="detail-time">
                🕐 ${habit.days.length === 7 ? 'Daily' : 'Custom'} at ${habit.habitTime || '8:00 AM'}
            </div>

            <div class="calendar-section">
                <h3>
                    <span>Total repetitions</span>
                    <button class="history-btn">✏️ History</button>
                </h3>
                <div class="total-reps">${totalReps}</div>
                <p class="since-date">Since ${new Date(habit.createdAt).toLocaleDateString()}</p>
            </div>

            <div class="stats-section">
                <h3>Records & streaks</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-label">Completion rate</div>
                        <div class="stat-value">${completionRate}%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Current streak</div>
                        <div class="stat-value">${streak} 🔥</div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    // ========================================================================
    // CALCULATIONS
    // ========================================================================

    calculateStreak(habit) {
        if (!habit.completions) return 0;

        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);

            const dateStr = this.formatDate(checkDate);

            if (habit.completions[dateStr]) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    calculateCompletionRate(habit) {
        if (!habit.completions || !habit.createdAt) return 0;

        const createdDate = new Date(habit.createdAt);
        const today = new Date();
        const daysSinceCreation = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));

        if (daysSinceCreation === 0) return 0;

        const completedDays = Object.values(habit.completions).filter(Boolean).length;
        return Math.round((completedDays / daysSinceCreation) * 100);
    }

    // ========================================================================
    // UTILITIES
    // ========================================================================

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AtomsApp());
} else {
    new AtomsApp();
}
