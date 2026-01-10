// ============================================================================
// DATA MODELS & STORAGE
// ============================================================================

// Routine definitions
const ROUTINES = {
    morning: {
        id: 'morning',
        name: 'Morning Routine',
        icon: '☀️',
        description: 'Start your day strong',
        habits: ['wake-6am', 'workout']
    },
    evening: {
        id: 'evening',
        name: 'Evening Routine',
        icon: '🌙',
        description: 'Wind down and prepare for rest',
        habits: ['no-phone-bedroom', 'read-before-bed', 'sleep-8hrs']
    },
    connections: {
        id: 'connections',
        name: 'Connections',
        icon: '❤️',
        description: 'Stay connected with loved ones',
        habits: ['call-jacob', 'weekly-checkin', 'date-kristen']
    }
};

// Habit data structure with recurrence patterns and routine assignments
const HABITS_DATA = [
    // Morning routine habits (6am - 9am)
    {
        id: 'wake-6am',
        name: 'Wake up at 6am',
        frequency: 'daily',
        time: 'morning',
        order: 1,
        icon: '☀️',
        routine: 'morning'
    },
    {
        id: 'workout',
        name: 'Workout for 45 min',
        frequency: 'daily',
        time: 'morning',
        order: 2,
        icon: '💪',
        routine: 'morning'
    },
    // Midday habits (12pm - 1pm)
    {
        id: 'lunch-walk',
        name: 'Go for 10 min walk at lunch',
        frequency: 'daily',
        time: 'afternoon',
        order: 3,
        icon: '🚶'
    },
    // Evening habits (9pm - 10pm)
    {
        id: 'no-phone-bedroom',
        name: 'No phone in bedroom',
        frequency: 'daily',
        time: 'evening',
        order: 4,
        icon: '📵',
        routine: 'evening'
    },
    {
        id: 'read-before-bed',
        name: 'Read before bed for 15 min',
        frequency: 'daily',
        time: 'evening',
        order: 5,
        icon: '📖',
        routine: 'evening'
    },
    {
        id: 'sleep-8hrs',
        name: 'Get 8 hours of sleep',
        frequency: 'daily',
        time: 'evening',
        order: 6,
        icon: '😴',
        routine: 'evening'
    },
    // Bi-weekly habit
    {
        id: 'call-jacob',
        name: 'Call Jacob',
        frequency: 'biweekly',
        time: 'anytime',
        order: 7,
        icon: '📞',
        biweeklyDay: 0, // Sunday (will check every 2 weeks)
        routine: 'connections'
    },
    // Weekly habit
    {
        id: 'weekly-checkin',
        name: 'Weekly check-in in Claude',
        frequency: 'weekly',
        time: 'anytime',
        order: 8,
        icon: '✍️',
        weeklyDay: 0, // Sunday
        routine: 'connections'
    },
    // Monthly habit
    {
        id: 'date-kristen',
        name: 'Go on date with Kristen',
        frequency: 'monthly',
        time: 'anytime',
        order: 9,
        icon: '❤️',
        routine: 'connections'
    }
];

// Storage management
class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'habit-tracker-2026';
        this.THEME_KEY = 'habit-tracker-theme';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const initialData = {
                habits: HABITS_DATA,
                completions: {}, // { 'YYYY-MM-DD': { habitId: true/false } }
                startDate: '2026-01-01'
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    }

    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    getCompletions(date) {
        const data = this.getData();
        return data.completions[date] || {};
    }

    toggleCompletion(habitId, date) {
        const data = this.getData();
        if (!data.completions[date]) {
            data.completions[date] = {};
        }
        data.completions[date][habitId] = !data.completions[date][habitId];
        this.saveData(data);
        return data.completions[date][habitId];
    }

    getHabits() {
        const data = this.getData();
        return data.habits;
    }

    getAllCompletions() {
        const data = this.getData();
        return data.completions;
    }

    getTheme() {
        return localStorage.getItem(this.THEME_KEY) || 'light';
    }

    setTheme(theme) {
        localStorage.setItem(this.THEME_KEY, theme);
    }
}

// ============================================================================
// DATE & RECURRENCE LOGIC
// ============================================================================

class DateUtils {
    static formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    static parseDate(dateString) {
        return new Date(dateString + 'T00:00:00');
    }

    static getWeekNumber(date) {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + startOfYear.getDay() + 1) / 7);
    }

    static isSameWeek(date1, date2) {
        return this.getWeekNumber(date1) === this.getWeekNumber(date2) &&
               date1.getFullYear() === date2.getFullYear();
    }

    static getMonthName(date) {
        return date.toLocaleString('en-US', { month: 'long' });
    }

    static getDayName(date) {
        return date.toLocaleString('en-US', { weekday: 'long' });
    }

    static isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    static isFuture(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        return compareDate > today;
    }

    static getDaysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1 - date2) / oneDay));
    }
}

// Check if a habit is applicable on a given date
class HabitScheduler {
    static isHabitApplicableOnDate(habit, date) {
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        const dateOfMonth = date.getDate();

        switch (habit.frequency) {
            case 'daily':
                return true;

            case 'weekly':
                return dayOfWeek === habit.weeklyDay;

            case 'biweekly':
                if (dayOfWeek !== habit.biweeklyDay) return false;
                const referenceDate = new Date('2026-01-05T00:00:00');
                const weeksSinceReference = Math.floor(
                    (date - referenceDate) / (7 * 24 * 60 * 60 * 1000)
                );
                return weeksSinceReference >= 0 && weeksSinceReference % 2 === 0;

            case 'monthly':
                return true;

            default:
                return false;
        }
    }

    static getApplicableHabitsForDate(habits, date) {
        return habits
            .filter(habit => this.isHabitApplicableOnDate(habit, date))
            .sort((a, b) => a.order - b.order);
    }
}

// ============================================================================
// STREAK & STATISTICS
// ============================================================================

class StreakCalculator {
    static getCurrentStreak(habitId, completions, endDate = new Date()) {
        let streak = 0;
        let currentDate = new Date(endDate);
        const habits = HABITS_DATA;
        const habit = habits.find(h => h.id === habitId);

        if (!habit) return 0;

        while (true) {
            const dateStr = DateUtils.formatDate(currentDate);
            const isApplicable = HabitScheduler.isHabitApplicableOnDate(habit, currentDate);

            if (isApplicable) {
                const dayCompletions = completions[dateStr] || {};
                if (dayCompletions[habitId]) {
                    streak++;
                } else {
                    break;
                }
            }

            currentDate.setDate(currentDate.getDate() - 1);

            // Don't go before 2026
            if (currentDate.getFullYear() < 2026) break;
        }

        return streak;
    }

    static getLongestStreak(habitId, completions) {
        let longestStreak = 0;
        let currentStreak = 0;
        const habit = HABITS_DATA.find(h => h.id === habitId);

        if (!habit) return 0;

        // Start from Jan 1, 2026
        const startDate = new Date('2026-01-01');
        const endDate = new Date();
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const dateStr = DateUtils.formatDate(currentDate);
            const isApplicable = HabitScheduler.isHabitApplicableOnDate(habit, currentDate);

            if (isApplicable) {
                const dayCompletions = completions[dateStr] || {};
                if (dayCompletions[habitId]) {
                    currentStreak++;
                    longestStreak = Math.max(longestStreak, currentStreak);
                } else {
                    currentStreak = 0;
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return longestStreak;
    }

    static getCompletionRate(habitId, completions, days = 30) {
        const habit = HABITS_DATA.find(h => h.id === habitId);
        if (!habit) return 0;

        let applicableDays = 0;
        let completedDays = 0;
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - days);

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const isApplicable = HabitScheduler.isHabitApplicableOnDate(habit, currentDate);
            if (isApplicable) {
                applicableDays++;
                const dateStr = DateUtils.formatDate(currentDate);
                const dayCompletions = completions[dateStr] || {};
                if (dayCompletions[habitId]) {
                    completedDays++;
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return applicableDays > 0 ? Math.round((completedDays / applicableDays) * 100) : 0;
    }
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

class HabitTrackerApp {
    constructor() {
        this.storage = new StorageManager();
        this.currentView = 'today';
        this.selectedDate = new Date();
        this.calendarDate = new Date();
        this.calendarMode = 'month';
        this.selectedHabitId = null;

        this.init();
    }

    init() {
        this.initializeTheme();
        this.setupEventListeners();
        this.render();
    }

    initializeTheme() {
        const savedTheme = this.storage.getTheme();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');

        document.body.classList.toggle('dark-mode', theme === 'dark');
        this.updateThemeIcon(theme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Today view date navigation
        document.getElementById('prev-day')?.addEventListener('click', () => {
            this.navigateDay(-1);
        });

        document.getElementById('next-day')?.addEventListener('click', () => {
            this.navigateDay(1);
        });

        // Calendar controls
        document.getElementById('prev-period')?.addEventListener('click', () => {
            this.navigatePeriod(-1);
        });

        document.getElementById('next-period')?.addEventListener('click', () => {
            this.navigatePeriod(1);
        });

        document.getElementById('today-btn')?.addEventListener('click', () => {
            this.calendarDate = new Date();
            this.renderCalendarView();
        });

        document.getElementById('calendar-mode')?.addEventListener('change', (e) => {
            this.calendarMode = e.target.value;
            this.renderCalendarView();
        });

        document.getElementById('selected-habit')?.addEventListener('change', (e) => {
            this.selectedHabitId = e.target.value;
            this.renderCalendarView();
        });

        // Modal
        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('edit-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'edit-modal') {
                this.closeModal();
            }
        });
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        const theme = isDark ? 'dark' : 'light';
        this.storage.setTheme(theme);
        this.updateThemeIcon(theme);
    }

    navigateDay(direction) {
        this.selectedDate.setDate(this.selectedDate.getDate() + direction);
        this.renderTodayView();
    }

    switchView(view) {
        this.currentView = view;

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        document.querySelectorAll('.view').forEach(viewEl => {
            viewEl.classList.remove('active');
        });
        document.getElementById(`${view}-view`).classList.add('active');

        this.render();
    }

    render() {
        if (this.currentView === 'today') {
            this.renderTodayView();
        } else if (this.currentView === 'routines') {
            this.renderRoutinesView();
        } else if (this.currentView === 'calendar') {
            this.renderCalendarView();
        } else if (this.currentView === 'stats') {
            this.renderStatsView();
        }
    }

    renderTodayView() {
        const dateStr = DateUtils.formatDate(this.selectedDate);
        const habits = this.storage.getHabits();
        const applicableHabits = HabitScheduler.getApplicableHabitsForDate(habits, this.selectedDate);
        const completions = this.storage.getCompletions(dateStr);
        const isFuture = DateUtils.isFuture(this.selectedDate);

        // Update date header
        const dateHeaderText = DateUtils.isToday(this.selectedDate)
            ? `${DateUtils.getDayName(this.selectedDate)}, ${DateUtils.getMonthName(this.selectedDate)} ${this.selectedDate.getDate()}`
            : `${DateUtils.getDayName(this.selectedDate)}, ${DateUtils.getMonthName(this.selectedDate)} ${this.selectedDate.getDate()} ${isFuture ? '(Future)' : '(Past)'}`;

        document.getElementById('current-date').textContent = dateHeaderText;

        // Calculate completion info
        const completedCount = applicableHabits.filter(h => completions[h.id]).length;
        const totalCount = applicableHabits.length;
        document.getElementById('streak-info').textContent =
            `${completedCount} of ${totalCount} completed`;

        // Render habits list
        const habitsList = document.getElementById('habits-list');
        habitsList.innerHTML = '';

        if (applicableHabits.length === 0) {
            habitsList.innerHTML = '<p class="empty-state">No habits scheduled for this day. Enjoy!</p>';
            return;
        }

        applicableHabits.forEach(habit => {
            const habitEl = this.createHabitCheckbox(habit, dateStr, completions[habit.id], isFuture);
            habitsList.appendChild(habitEl);
        });
    }

    createHabitCheckbox(habit, date, isCompleted, isFuture) {
        const habitCard = document.createElement('div');
        habitCard.className = `habit-card ${isCompleted ? 'completed' : ''} ${isFuture ? 'future' : ''}`;

        const completions = this.storage.getAllCompletions();
        const currentStreak = StreakCalculator.getCurrentStreak(habit.id, completions);

        habitCard.innerHTML = `
            <div class="habit-checkbox">
                <input type="checkbox"
                       id="habit-${habit.id}-${date}"
                       ${isCompleted ? 'checked' : ''}
                       ${isFuture ? 'disabled' : ''}
                       data-habit-id="${habit.id}"
                       data-date="${date}">
                <label for="habit-${habit.id}-${date}">
                    <span class="checkmark"></span>
                </label>
            </div>
            <div class="habit-content">
                <div class="habit-icon">${habit.icon}</div>
                <div class="habit-info">
                    <h3 class="habit-name">${habit.name}</h3>
                    <p class="habit-frequency">${this.formatFrequency(habit.frequency)}</p>
                </div>
                ${currentStreak > 0 ? `<div class="streak-badge">🔥 ${currentStreak}</div>` : ''}
            </div>
        `;

        if (!isFuture) {
            const checkbox = habitCard.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                this.handleHabitToggle(e.target);
            });
        }

        return habitCard;
    }

    handleHabitToggle(checkbox) {
        const habitId = checkbox.dataset.habitId;
        const date = checkbox.dataset.date;
        const isCompleted = this.storage.toggleCompletion(habitId, date);

        const habitCard = checkbox.closest('.habit-card');
        habitCard.classList.toggle('completed', isCompleted);

        // Update streak badge
        const completions = this.storage.getAllCompletions();
        const currentStreak = StreakCalculator.getCurrentStreak(habitId, completions);
        const existingBadge = habitCard.querySelector('.streak-badge');

        if (currentStreak > 0) {
            if (existingBadge) {
                existingBadge.textContent = `🔥 ${currentStreak}`;
            } else {
                const badge = document.createElement('div');
                badge.className = 'streak-badge';
                badge.textContent = `🔥 ${currentStreak}`;
                habitCard.querySelector('.habit-content').appendChild(badge);
            }
        } else if (existingBadge) {
            existingBadge.remove();
        }

        this.updateStreakInfo();

        if (isCompleted) {
            habitCard.classList.add('check-animation');
            setTimeout(() => habitCard.classList.remove('check-animation'), 600);
        }
    }

    updateStreakInfo() {
        const dateStr = DateUtils.formatDate(this.selectedDate);
        const habits = this.storage.getHabits();
        const applicableHabits = HabitScheduler.getApplicableHabitsForDate(habits, this.selectedDate);
        const completions = this.storage.getCompletions(dateStr);

        const completedCount = applicableHabits.filter(h => completions[h.id]).length;
        const totalCount = applicableHabits.length;
        document.getElementById('streak-info').textContent =
            `${completedCount} of ${totalCount} completed`;
    }

    formatFrequency(frequency) {
        const map = {
            'daily': 'Every day',
            'weekly': 'Once a week',
            'biweekly': 'Every 2 weeks',
            'monthly': 'Once a month'
        };
        return map[frequency] || frequency;
    }

    renderRoutinesView() {
        const routinesList = document.getElementById('routines-list');
        routinesList.innerHTML = '';

        Object.values(ROUTINES).forEach(routine => {
            const routineCard = this.createRoutineCard(routine);
            routinesList.appendChild(routineCard);
        });
    }

    createRoutineCard(routine) {
        const habits = this.storage.getHabits().filter(h => routine.habits.includes(h.id));
        const completions = this.storage.getAllCompletions();
        const today = DateUtils.formatDate(new Date());
        const todayCompletions = completions[today] || {};

        const applicableToday = habits.filter(h =>
            HabitScheduler.isHabitApplicableOnDate(h, new Date())
        );
        const completedToday = applicableToday.filter(h => todayCompletions[h.id]);

        const routineCard = document.createElement('div');
        routineCard.className = 'routine-card';

        let habitsList = habits.map(h => {
            const streak = StreakCalculator.getCurrentStreak(h.id, completions);
            const isApplicableToday = HabitScheduler.isHabitApplicableOnDate(h, new Date());
            const isCompletedToday = todayCompletions[h.id];

            return `
                <div class="routine-habit ${isApplicableToday ? (isCompletedToday ? 'completed' : 'pending') : 'not-today'}">
                    <span class="routine-habit-icon">${h.icon}</span>
                    <span class="routine-habit-name">${h.name}</span>
                    ${streak > 0 ? `<span class="routine-habit-streak">🔥 ${streak}</span>` : ''}
                </div>
            `;
        }).join('');

        routineCard.innerHTML = `
            <div class="routine-header">
                <div class="routine-icon">${routine.icon}</div>
                <div class="routine-info">
                    <h3 class="routine-name">${routine.name}</h3>
                    <p class="routine-description">${routine.description}</p>
                </div>
            </div>
            <div class="routine-progress">
                <div class="routine-progress-bar">
                    <div class="routine-progress-fill" style="width: ${applicableToday.length > 0 ? (completedToday.length / applicableToday.length * 100) : 0}%"></div>
                </div>
                <span class="routine-progress-text">${completedToday.length}/${applicableToday.length} today</span>
            </div>
            <div class="routine-habits">
                ${habitsList}
            </div>
        `;

        return routineCard;
    }

    renderCalendarView() {
        const habitSelect = document.getElementById('selected-habit');
        if (habitSelect.options.length <= 4) {
            const habits = this.storage.getHabits();
            habits.forEach(habit => {
                const option = document.createElement('option');
                option.value = habit.id;
                option.textContent = `${habit.icon} ${habit.name}`;
                habitSelect.appendChild(option);
            });
        }

        if (!this.selectedHabitId) {
            document.getElementById('calendar-display').innerHTML =
                '<p class="empty-state">Select a habit or view to display</p>';
            return;
        }

        const calendarDisplay = document.getElementById('calendar-display');

        if (this.selectedHabitId === '__all__') {
            calendarDisplay.innerHTML = this.renderHeatMap();
        } else if (this.selectedHabitId.startsWith('__routine__')) {
            const routineId = this.selectedHabitId.replace('__routine__', '');
            calendarDisplay.innerHTML = this.renderRoutineCalendar(routineId);
        } else {
            const habits = this.storage.getHabits();
            const selectedHabit = habits.find(h => h.id === this.selectedHabitId);

            if (!selectedHabit) return;

            if (this.calendarMode === 'week') {
                calendarDisplay.innerHTML = this.renderWeekCalendar(selectedHabit);
            } else if (this.calendarMode === 'month') {
                calendarDisplay.innerHTML = this.renderMonthCalendar(selectedHabit);
            } else {
                calendarDisplay.innerHTML = this.renderYearCalendar(selectedHabit);
            }
        }
    }

    renderHeatMap() {
        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const habits = this.storage.getHabits();
        const completions = this.storage.getAllCompletions();

        let html = `<div class="calendar-month heat-map">`;
        html += `<h3 class="month-title">${DateUtils.getMonthName(firstDay)} ${year} - All Habits</h3>`;
        html += '<div class="calendar-header">';

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekDays.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        html += '</div>';

        html += '<div class="calendar-grid">';

        for (let i = 0; i < startDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateStr = DateUtils.formatDate(date);
            const isToday = DateUtils.isToday(date);
            const isFuture = DateUtils.isFuture(date);

            const applicableHabits = HabitScheduler.getApplicableHabitsForDate(habits, date);
            const dayCompletions = completions[dateStr] || {};
            const completedCount = applicableHabits.filter(h => dayCompletions[h.id]).length;
            const totalCount = applicableHabits.length;

            const completionRate = totalCount > 0 ? completedCount / totalCount : 0;

            let intensity = 'heat-0';
            if (completionRate === 1) intensity = 'heat-100';
            else if (completionRate >= 0.75) intensity = 'heat-75';
            else if (completionRate >= 0.5) intensity = 'heat-50';
            else if (completionRate >= 0.25) intensity = 'heat-25';

            let className = `calendar-day heat-day ${intensity}`;
            if (isToday) className += ' today';
            if (isFuture) className += ' future';

            html += `
                <div class="${className}" data-date="${dateStr}">
                    <div class="day-number">${day}</div>
                    <div class="heat-info">${completedCount}/${totalCount}</div>
                </div>
            `;
        }

        html += '</div>';
        html += '<div class="heat-legend">';
        html += '<span>Less</span>';
        html += '<div class="heat-0"></div>';
        html += '<div class="heat-25"></div>';
        html += '<div class="heat-50"></div>';
        html += '<div class="heat-75"></div>';
        html += '<div class="heat-100"></div>';
        html += '<span>More</span>';
        html += '</div>';
        html += '</div>';

        return html;
    }

    renderRoutineCalendar(routineId) {
        const routine = ROUTINES[routineId];
        if (!routine) return '<p class="empty-state">Routine not found</p>';

        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const habits = this.storage.getHabits().filter(h => routine.habits.includes(h.id));
        const completions = this.storage.getAllCompletions();

        let html = `<div class="calendar-month routine-calendar">`;
        html += `<h3 class="month-title">${routine.icon} ${routine.name} - ${DateUtils.getMonthName(firstDay)} ${year}</h3>`;
        html += '<div class="calendar-header">';

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekDays.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        html += '</div>';

        html += '<div class="calendar-grid">';

        for (let i = 0; i < startDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateStr = DateUtils.formatDate(date);
            const isToday = DateUtils.isToday(date);
            const isFuture = DateUtils.isFuture(date);

            const applicableHabits = habits.filter(h =>
                HabitScheduler.isHabitApplicableOnDate(h, date)
            );
            const dayCompletions = completions[dateStr] || {};
            const completedCount = applicableHabits.filter(h => dayCompletions[h.id]).length;
            const totalCount = applicableHabits.length;

            const completionRate = totalCount > 0 ? completedCount / totalCount : 0;

            let intensity = 'heat-0';
            if (completionRate === 1) intensity = 'heat-100';
            else if (completionRate >= 0.75) intensity = 'heat-75';
            else if (completionRate >= 0.5) intensity = 'heat-50';
            else if (completionRate >= 0.25) intensity = 'heat-25';

            let className = `calendar-day heat-day ${intensity}`;
            if (isToday) className += ' today';
            if (isFuture) className += ' future';

            html += `
                <div class="${className}">
                    <div class="day-number">${day}</div>
                    ${totalCount > 0 ? `<div class="heat-info">${completedCount}/${totalCount}</div>` : ''}
                </div>
            `;
        }

        html += '</div></div>';
        return html;
    }

    renderWeekCalendar(habit) {
        const startOfWeek = new Date(this.calendarDate);
        startOfWeek.setDate(this.calendarDate.getDate() - this.calendarDate.getDay());

        const completions = this.storage.getAllCompletions();
        const currentStreak = StreakCalculator.getCurrentStreak(habit.id, completions);
        const longestStreak = StreakCalculator.getLongestStreak(habit.id, completions);

        let html = '<div class="calendar-week">';
        html += `<div class="streak-summary">
            <div class="streak-item">
                <span class="streak-label">Current Streak</span>
                <span class="streak-value">🔥 ${currentStreak}</span>
            </div>
            <div class="streak-item">
                <span class="streak-label">Longest Streak</span>
                <span class="streak-value">⭐ ${longestStreak}</span>
            </div>
        </div>`;

        html += '<div class="calendar-header">';

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekDays.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        html += '</div>';

        html += '<div class="calendar-days">';

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateStr = DateUtils.formatDate(date);
            const isApplicable = HabitScheduler.isHabitApplicableOnDate(habit, date);
            const dayCompletions = completions[dateStr] || {};
            const isCompleted = dayCompletions[habit.id];
            const isToday = DateUtils.isToday(date);
            const isFuture = DateUtils.isFuture(date);

            let className = 'calendar-day';
            if (isToday) className += ' today';
            if (isFuture) className += ' future';
            if (!isApplicable) className += ' not-applicable';
            else if (isCompleted) className += ' completed';
            else className += ' applicable';

            html += `
                <div class="${className}" ${!isFuture ? `data-date="${dateStr}" data-habit="${habit.id}"` : ''}>
                    <div class="day-number">${date.getDate()}</div>
                    ${isCompleted ? '<div class="check-icon">✓</div>' : ''}
                </div>
            `;
        }

        html += '</div></div>';
        return html;
    }

    renderMonthCalendar(habit) {
        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();

        const completions = this.storage.getAllCompletions();
        const currentStreak = StreakCalculator.getCurrentStreak(habit.id, completions);
        const longestStreak = StreakCalculator.getLongestStreak(habit.id, completions);
        const completionRate = StreakCalculator.getCompletionRate(habit.id, completions, 30);

        let html = `<div class="calendar-month">`;
        html += `<h3 class="month-title">${habit.icon} ${habit.name}</h3>`;
        html += `<div class="streak-summary">
            <div class="streak-item">
                <span class="streak-label">Current</span>
                <span class="streak-value">🔥 ${currentStreak}</span>
            </div>
            <div class="streak-item">
                <span class="streak-label">Longest</span>
                <span class="streak-value">⭐ ${longestStreak}</span>
            </div>
            <div class="streak-item">
                <span class="streak-label">30-Day Rate</span>
                <span class="streak-value">${completionRate}%</span>
            </div>
        </div>`;

        html += `<h4 class="calendar-subtitle">${DateUtils.getMonthName(firstDay)} ${year}</h4>`;
        html += '<div class="calendar-header">';

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekDays.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        html += '</div>';

        html += '<div class="calendar-grid">';

        for (let i = 0; i < startDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateStr = DateUtils.formatDate(date);
            const isApplicable = HabitScheduler.isHabitApplicableOnDate(habit, date);
            const dayCompletions = completions[dateStr] || {};
            const isCompleted = dayCompletions[habit.id];
            const isToday = DateUtils.isToday(date);
            const isFuture = DateUtils.isFuture(date);

            let className = 'calendar-day';
            if (isToday) className += ' today';
            if (isFuture) className += ' future';
            if (!isApplicable) className += ' not-applicable';
            else if (isCompleted) className += ' completed';
            else className += ' applicable';

            html += `
                <div class="${className}" ${!isFuture && isApplicable ? `data-date="${dateStr}" data-habit="${habit.id}"` : ''}>
                    <div class="day-number">${day}</div>
                    ${isCompleted ? '<div class="check-icon">✓</div>' : ''}
                </div>
            `;
        }

        html += '</div></div>';
        return html;
    }

    renderYearCalendar(habit) {
        const year = this.calendarDate.getFullYear();
        const completions = this.storage.getAllCompletions();
        const currentStreak = StreakCalculator.getCurrentStreak(habit.id, completions);
        const longestStreak = StreakCalculator.getLongestStreak(habit.id, completions);

        let html = `<div class="calendar-year">`;
        html += `<h3 class="year-title">${habit.icon} ${habit.name} - ${year}</h3>`;
        html += `<div class="streak-summary">
            <div class="streak-item">
                <span class="streak-label">Current Streak</span>
                <span class="streak-value">🔥 ${currentStreak}</span>
            </div>
            <div class="streak-item">
                <span class="streak-label">Longest Streak</span>
                <span class="streak-value">⭐ ${longestStreak}</span>
            </div>
        </div>`;
        html += '<div class="year-grid">';

        for (let month = 0; month < 12; month++) {
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);

            html += `<div class="mini-month">`;
            html += `<h4 class="mini-month-title">${DateUtils.getMonthName(firstDay)}</h4>`;
            html += '<div class="mini-month-grid">';

            const startDay = firstDay.getDay();

            for (let i = 0; i < startDay; i++) {
                html += '<div class="mini-day empty"></div>';
            }

            for (let day = 1; day <= lastDay.getDate(); day++) {
                const date = new Date(year, month, day);
                const dateStr = DateUtils.formatDate(date);
                const isApplicable = HabitScheduler.isHabitApplicableOnDate(habit, date);
                const dayCompletions = completions[dateStr] || {};
                const isCompleted = dayCompletions[habit.id];
                const isToday = DateUtils.isToday(date);
                const isFuture = DateUtils.isFuture(date);

                let className = 'mini-day';
                if (isToday) className += ' today';
                if (isFuture) className += ' future';
                if (!isApplicable) className += ' not-applicable';
                else if (isCompleted) className += ' completed';
                else className += ' applicable';

                html += `<div class="${className}" title="${dateStr}"></div>`;
            }

            html += '</div></div>';
        }

        html += '</div></div>';
        return html;
    }

    renderStatsView() {
        const statsContent = document.getElementById('stats-content');
        const habits = this.storage.getHabits();
        const completions = this.storage.getAllCompletions();

        let html = '<div class="stats-grid">';

        // Overall stats card
        const totalDays = Object.keys(completions).length;
        let totalPossible = 0;
        let totalCompleted = 0;

        Object.keys(completions).forEach(dateStr => {
            const date = DateUtils.parseDate(dateStr);
            const applicable = HabitScheduler.getApplicableHabitsForDate(habits, date);
            totalPossible += applicable.length;
            applicable.forEach(h => {
                if (completions[dateStr][h.id]) totalCompleted++;
            });
        });

        const overallRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

        html += `
            <div class="stat-card overall-stat">
                <h3>Overall Progress</h3>
                <div class="stat-value-large">${overallRate}%</div>
                <p class="stat-description">Completion rate across all habits</p>
                <div class="stat-details">
                    <div class="stat-detail-item">
                        <span class="stat-detail-label">Days tracked</span>
                        <span class="stat-detail-value">${totalDays}</span>
                    </div>
                    <div class="stat-detail-item">
                        <span class="stat-detail-label">Total completions</span>
                        <span class="stat-detail-value">${totalCompleted}</span>
                    </div>
                </div>
            </div>
        `;

        // Individual habit stats
        habits.forEach(habit => {
            const currentStreak = StreakCalculator.getCurrentStreak(habit.id, completions);
            const longestStreak = StreakCalculator.getLongestStreak(habit.id, completions);
            const rate30 = StreakCalculator.getCompletionRate(habit.id, completions, 30);
            const rate7 = StreakCalculator.getCompletionRate(habit.id, completions, 7);

            html += `
                <div class="stat-card habit-stat">
                    <div class="stat-card-header">
                        <span class="stat-habit-icon">${habit.icon}</span>
                        <h4 class="stat-habit-name">${habit.name}</h4>
                    </div>
                    <div class="stat-streaks">
                        <div class="stat-streak-item">
                            <span class="stat-streak-icon">🔥</span>
                            <span class="stat-streak-value">${currentStreak}</span>
                            <span class="stat-streak-label">Current</span>
                        </div>
                        <div class="stat-streak-item">
                            <span class="stat-streak-icon">⭐</span>
                            <span class="stat-streak-value">${longestStreak}</span>
                            <span class="stat-streak-label">Longest</span>
                        </div>
                    </div>
                    <div class="stat-rates">
                        <div class="stat-rate-item">
                            <span class="stat-rate-label">Last 7 days</span>
                            <div class="stat-rate-bar">
                                <div class="stat-rate-fill" style="width: ${rate7}%"></div>
                            </div>
                            <span class="stat-rate-value">${rate7}%</span>
                        </div>
                        <div class="stat-rate-item">
                            <span class="stat-rate-label">Last 30 days</span>
                            <div class="stat-rate-bar">
                                <div class="stat-rate-fill" style="width: ${rate30}%"></div>
                            </div>
                            <span class="stat-rate-value">${rate30}%</span>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        statsContent.innerHTML = html;
    }

    navigatePeriod(direction) {
        if (this.calendarMode === 'week') {
            this.calendarDate.setDate(this.calendarDate.getDate() + (direction * 7));
        } else if (this.calendarMode === 'month') {
            this.calendarDate.setMonth(this.calendarDate.getMonth() + direction);
        } else {
            this.calendarDate.setFullYear(this.calendarDate.getFullYear() + direction);
        }
        this.renderCalendarView();
    }

    closeModal() {
        document.getElementById('edit-modal').classList.remove('active');
    }
}

// ============================================================================
// INITIALIZE APP
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    new HabitTrackerApp();
});
