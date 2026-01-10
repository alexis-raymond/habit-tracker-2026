# 2026 Habit Tracker - Enhanced Edition

A production-ready, feature-rich habit tracking web app built following Atomic Habits principles by James Clear. Track, analyze, and maintain consistent habits throughout 2026 with powerful insights and beautiful visualizations.

## 🎯 What's New in Phase 1

### Core Enhancements
- **🌙 Dark Mode** - Auto-detects system preference, manual toggle available
- **📅 Past Day Editing** - Navigate to any day and check off habits retroactively
- **🔥 Combined Heat Map** - See all habits at once with color-coded completion intensity
- **🎨 Routine Grouping** - Habits organized into Morning, Evening, and Connections routines
- **⚡ Streak Tracking** - Current and longest streak visualization with fire badges
- **📊 Statistics Dashboard** - Comprehensive insights with 7-day and 30-day completion rates

## ✨ Features

### 1. Today View
- **Smart Daily Checklist**: Shows only habits scheduled for today based on recurrence
- **Time-Ordered Display**: Habits organized by time of day (morning → afternoon → evening)
- **Past Day Navigation**: Arrow buttons to navigate to yesterday or any previous day
- **Real-time Streak Badges**: See your current streak next to each habit
- **Progress Tracking**: Live completion counter showing your daily progress
- **Satisfying Animations**: Smooth check-off animations for positive reinforcement

### 2. Routines View (NEW!)
- **Morning Routine**: Wake up at 6am, Workout
- **Evening Routine**: No phone in bedroom, Read before bed, Get 8 hours sleep
- **Connections**: Call Jacob, Weekly check-in, Date with Kristen
- **Progress Bars**: Visual completion progress for each routine today
- **Streak Display**: See current streaks for all habits in each routine
- **Status Indicators**: Completed (green), Pending (pink), Not Today (grayed out)

### 3. Calendar View - Enhanced
- **Multiple Viewing Modes**:
  - **Single Habit**: Week/Month/Year view for one habit
  - **All Habits Heat Map**: See completion intensity across all habits (NEW!)
  - **Routine Calendars**: View specific routine completion over time (NEW!)
- **Streak Summary**: Current streak, longest streak, 30-day completion rate
- **Three Color States**:
  - Gray: Not applicable (habit not scheduled)
  - White with border: Applicable (should be completed)
  - Green gradient: Completed (intensity shows completion rate)
- **Interactive**: Click on past days to edit completions
- **Future Protection**: Can't check off habits that haven't happened yet

### 4. Stats Dashboard (NEW!)
- **Overall Progress Card**:
  - Total completion percentage
  - Days tracked
  - Total habit completions
- **Per-Habit Analytics**:
  - Current and longest streaks with fire (🔥) and star (⭐) icons
  - Last 7 days completion rate with visual progress bar
  - Last 30 days completion rate with visual progress bar
- **Beautiful Visualizations**: Gradient progress bars and clean card layouts

### 5. Dark Mode (NEW!)
- **Auto-Detection**: Respects your system's dark mode preference
- **Manual Toggle**: Moon/Sun icon in header to switch themes
- **Persistent**: Remembers your preference across sessions
- **Fully Themed**: Every component optimized for both light and dark modes
- **Smooth Transition**: Elegant color transitions when switching themes

### 6. Past Day Editing (NEW!)
- **Navigate Any Day**: Use arrow buttons in Today view
- **Full History**: Check off habits you forgot to log
- **No Future Dates**: Can't accidentally log habits that haven't happened
- **Smart Streak Calculation**: Streaks update correctly based on actual completion dates

## 🎨 Design Philosophy

### Modern & Sleek
- **Airbnb-Inspired**: Clean, professional, and approachable design
- **Responsive**: Seamlessly adapts to mobile phones, tablets, and desktops
- **Touch-Friendly**: Large tap targets optimized for mobile use
- **Smooth Animations**: Delightful micro-interactions throughout

### Atomic Habits Integration
1. **Make it Obvious** (1st Law):
   - Time-ordered list shows exactly when to do each habit
   - Visual cues with emojis and routines
   - Streak badges make progress visible

2. **Make it Attractive** (2nd Law):
   - Beautiful modern design makes you want to use it
   - Satisfying check-off animations
   - Dark mode for evening use

3. **Make it Easy** (3rd Law):
   - One-tap completion anywhere
   - Smart filtering shows only today's habits
   - Routine grouping reduces cognitive load

4. **Make it Satisfying** (4th Law):
   - Visual progress tracking
   - Streak gamification
   - Heat maps show patterns
   - Statistics celebrate wins

## 📱 How to Use

### Getting Started
1. Open `index.html` in any modern web browser
2. The app auto-detects your system's theme (light/dark)
3. Start checking off today's habits!

### View Navigation
- **Today**: Your daily checklist with navigation to past days
- **Routines**: See grouped habits and routine progress
- **Calendar**: Visualize patterns and streaks over time
- **Stats**: Analyze your performance with detailed metrics

### Daily Workflow
1. **Morning**: Open Today view, check off morning routine habits
2. **Lunch**: Check off your lunch walk
3. **Evening**: Complete evening routine before bed
4. **Weekly**: Sunday check-in and Jacob call reminders

### Calendar Insights
1. **Select "All Habits (Heat Map)"**: See overall completion patterns
2. **Pick a Specific Habit**: Dive deep into that habit's history
3. **View a Routine**: See how well you're maintaining your routines
4. **Switch Time Periods**: Week for recent patterns, year for big picture

### Statistics Review
- **Weekly**: Check 7-day rates to catch slipping habits early
- **Monthly**: Review 30-day trends for habit stability
- **Celebrate**: Acknowledge your longest streaks and high completion rates

## 🎯 Your Pre-Configured Setup

### Daily Habits (Every Day)
- ☀️ Wake up at 6am - Morning kickstart
- 💪 Workout for 45 min - Physical health
- 🚶 Go for 10 min walk at lunch - Midday reset
- 📵 No phone in bedroom - Evening routine
- 📖 Read before bed for 15 min - Wind down
- 😴 Get 8 hours of sleep - Recovery

### Bi-weekly Habit (Every 2 weeks, Sunday)
- 📞 Call Jacob - Family connection

### Weekly Habit (Every Sunday)
- ✍️ Weekly check-in in Claude - Reflection & alignment

### Monthly Habit
- ❤️ Go on date with Kristen - Relationship maintenance

### Routine Groups
1. **Morning Routine** (☀️): Wake + Workout
2. **Evening Routine** (🌙): No phone + Read + Sleep
3. **Connections** (❤️): Jacob + Check-in + Date

## 🔥 Streak System Explained

### Current Streak
- Counts consecutive completions up to today
- Resets to 0 if you miss an applicable day
- Shows as fire badge (🔥) next to habits

### Longest Streak
- Your personal best for that habit
- Never resets, only grows
- Shows as star badge (⭐) in stats and calendar

### Completion Rate
- **7-day**: Recent habit strength, catch issues early
- **30-day**: Overall habit consistency, long-term view
- Shows as percentage with visual progress bar

## 💾 Data Management

### Storage
- **Local Storage**: All data stored in your browser
- **Persistent**: Data survives browser restarts
- **Private**: Never leaves your device
- **No Account**: No login required

### Data Structure
```
{
  habits: [...],
  completions: {
    "2026-01-09": {
      "wake-6am": true,
      "workout": true,
      ...
    }
  },
  startDate: "2026-01-01"
}
```

### Theme Preference
Stored separately as `habit-tracker-theme` (light/dark)

## 🌐 Accessing on Different Devices

### Mobile Phone (iPhone/Android)
1. Transfer files via email, AirDrop, or cloud storage
2. Open `index.html` in Safari (iPhone) or Chrome (Android)
3. Bookmark for quick access
4. **Pro tip**: Add to home screen for app-like experience
   - iOS: Tap Share → Add to Home Screen
   - Android: Tap Menu → Add to Home Screen

### iPad
1. Same process as mobile
2. Optimized for both portrait and landscape
3. Perfect for weekly reviews and calendar viewing

### Desktop/Laptop
1. Double-click `index.html` or open in browser
2. Bookmark for daily access
3. Best for stats review and heat map analysis

## 🎨 Customization

### Adding/Modifying Habits
Edit `HABITS_DATA` in `app.js` (lines 31-120):

```javascript
{
    id: 'unique-id',
    name: 'Display name',
    frequency: 'daily', // daily, weekly, biweekly, monthly
    time: 'morning', // morning, afternoon, evening, anytime
    order: 1, // Display order (lower numbers first)
    icon: '🎯', // Emoji icon
    routine: 'morning' // Optional: 'morning', 'evening', or 'connections'
}
```

### Modifying Routines
Edit `ROUTINES` in `app.js` (lines 6-28):

```javascript
routineName: {
    id: 'routine-id',
    name: 'Display Name',
    icon: '🎨',
    description: 'Short description',
    habits: ['habit-id-1', 'habit-id-2']
}
```

## 🚀 Deployment Options

### Option 1: Local Files
Keep files on your devices, open directly in browser.

### Option 2: GitHub Pages (Recommended)
1. Create GitHub repository
2. Upload index.html, app.js, styles.css
3. Enable GitHub Pages in Settings
4. Access from any device: `https://yourusername.github.io/habit-tracker`

### Option 3: Cloud Storage
Upload to Dropbox, Google Drive, iCloud and open from there.

### Option 4: Simple Web Server
For local network access:
```bash
python -m http.server 8000
# Then open http://localhost:8000 on any device on your network
```

## 📊 Feature Comparison

| Feature | Basic Version | Phase 1 (Current) |
|---------|--------------|------------------|
| Daily checklist | ✅ | ✅ |
| Single habit calendar | ✅ | ✅ |
| Dark mode | ❌ | ✅ |
| Past day editing | ❌ | ✅ |
| Heat map (all habits) | ❌ | ✅ |
| Routine grouping | ❌ | ✅ |
| Streak tracking | ❌ | ✅ |
| Statistics dashboard | ❌ | ✅ |
| Routine calendars | ❌ | ✅ |

## 🔮 Future Enhancements (Phase 2+)

### Coming Soon
- **Habit Editing UI**: Add/remove/modify habits without code
- **Notes on Habits**: Quick notes for specific days
- **Data Export/Import**: Backup and transfer your data
- **Weekly Summary Generator**: Auto-generate Claude check-in content
- **Identity Goal Integration**: Link habits to your identity goals
- **Motivational System**: Atomic Habits quotes and encouragement

### Under Consideration
- **Browser Notifications**: Reminders for habit times
- **Share Progress**: Generate shareable streak images
- **Year-in-Review**: Comprehensive annual summary
- **Habit Stacking Visualization**: See connections between habits
- **2-Minute Rule Helper**: Scaled-down versions for hard days

## 🛠️ Technical Details

### Files
- `index.html` - App structure with all views
- `app.js` - Complete application logic (1,172 lines)
- `styles.css` - Comprehensive styling with dark mode (1,442 lines)

### Browser Support
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### Technologies
- Vanilla JavaScript (ES6+)
- CSS3 with CSS Variables
- LocalStorage API
- No external dependencies

### Performance
- Instant load time
- Smooth 60fps animations
- Efficient rendering
- Minimal memory footprint

## 🎓 Atomic Habits Principles Applied

### The 4 Laws Implementation

**1st Law - Make it Obvious:**
- ✅ Implementation intentions (time-ordered habits)
- ✅ Environment design reminders (phone charging station habit)
- ✅ Visual cues (emojis, routine grouping)
- ✅ Habit tracking (streak visualization)

**2nd Law - Make it Attractive:**
- ✅ Temptation bundling (satisfying check-off experience)
- ✅ Join a culture (identity goals displayed)
- ✅ Attractive design (modern, pleasant interface)

**3rd Law - Make it Easy:**
- ✅ Reduce friction (one-tap completion)
- ✅ Prime the environment (routines reduce decisions)
- ✅ Two-minute rule (simple check-off action)
- ✅ Automate (smart recurrence filtering)

**4th Law - Make it Satisfying:**
- ✅ Immediate reward (animations, streak badges)
- ✅ Visual measurement (heat maps, progress bars)
- ✅ Never break the chain (streak tracking)
- ✅ Progress tracking (stats dashboard)

## 💡 Tips for Success

### Daily Use
- **Morning**: Check app first thing, sets positive tone
- **Evening**: Review before bed, tomorrow's preview
- **Be Honest**: Missing days happens, log accurately for insights

### Weekly Review
- **Check Stats**: Identify which habits need attention
- **Review Heat Map**: Look for patterns in completion
- **Adjust Approach**: Use 7-day rates to catch issues early

### Monthly Reflection
- **Celebrate Wins**: Acknowledge your longest streaks
- **Analyze Trends**: What habits are strongest? Why?
- **Refine System**: Are your routines working? Adjust if needed

### Integration with Your Goal System
- **Identity Goals**: Habits reinforce who you're becoming
- **Outcome Goals**: Habits are the inputs that drive results
- **Weekly Check-ins**: Use stats to inform your Claude conversations

## 🐛 Troubleshooting

### Data Not Saving
- Check if browser allows localStorage
- Don't use Incognito/Private mode
- Clear cache may erase data (export first when available)

### Dark Mode Not Working
- Check if browser supports `prefers-color-scheme`
- Try manual toggle (moon/sun button)
- Check browser theme settings

### Streaks Seem Wrong
- Streaks only count applicable days
- Missing one applicable day resets current streak
- Longest streak is your all-time best

### Calendar Colors Confusing
- Gray = not scheduled for that habit
- White/outlined = scheduled but not done
- Green = completed
- Heat map intensity = completion percentage

## 📄 License & Credits

Built with ❤️ for your 2026 goals journey.

**Inspired by:**
- Atomic Habits by James Clear
- Airbnb Design System
- GitHub Contribution Graph
- Duolingo Streak System

**Created for:** Your "Familyhood" chapter - becoming the partner, family man, and intentional person you're working toward.

---

*"You do not rise to the level of your goals. You fall to the level of your systems."* - James Clear

Ready to build unbreakable habits in 2026? Start tracking today! 🚀
