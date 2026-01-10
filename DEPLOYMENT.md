# Deployment Guide: GitHub Pages

Follow these steps to deploy your habit tracker to GitHub Pages and access it from any device.

---

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Fill in the details:
   - **Repository name**: `habit-tracker-2026` (or your preference)
   - **Description**: "Personal habit tracker for 2026 goals"
   - **Visibility**: ✅ **Public** (required for free GitHub Pages)
   - **DO NOT** initialize with README (we already have one)
4. Click **Create repository**

---

## Step 2: Push Your Code to GitHub

GitHub will show you instructions. Use the **"push an existing repository"** option:

```bash
cd "/Users/aleraymo/Documents/Obsidian Vault/Calendar Habit Tracker"

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/habit-tracker-2026.git

# Push your code
git branch -M main
git push -u origin main
```

**Example** (if your username is `alexray`):
```bash
git remote add origin https://github.com/alexray/habit-tracker-2026.git
git branch -M main
git push -u origin main
```

---

## Step 3: Enable GitHub Pages

1. In your GitHub repository, click **Settings** (top menu)
2. In the left sidebar, click **Pages** (under "Code and automation")
3. Under **Source**:
   - Select **Deploy from a branch**
   - **Branch**: Select `main`
   - **Folder**: Select `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes for deployment
6. **Your site will be live at**: `https://YOUR_USERNAME.github.io/habit-tracker-2026/`

---

## Step 4: Access on Your iPhone

### Option A: Safari (Direct Access)
1. Open Safari on your iPhone
2. Go to: `https://YOUR_USERNAME.github.io/habit-tracker-2026/`
3. Bookmark it for easy access

### Option B: Add to Home Screen (Recommended - App Experience)
1. Open the site in Safari
2. Tap the **Share** button (box with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Name it "Habits" (or your preference)
5. Tap **Add**
6. Now you have an app icon on your home screen! 📱

---

## Step 5: Future Updates

Whenever you want to add features or make changes:

### 1. Make your changes in the files
Edit `app.js`, `styles.css`, or `index.html` as needed.

### 2. Commit your changes
```bash
cd "/Users/aleraymo/Documents/Obsidian Vault/Calendar Habit Tracker"
git add .
git commit -m "Description of your changes"
```

### 3. Push to GitHub
```bash
git push
```

### 4. Wait 1-2 minutes
GitHub Pages will automatically rebuild and deploy your changes!

---

## Git Workflow Best Practices

### Descriptive Commit Messages
Instead of "updates" or "fixes", use clear messages:
```bash
git commit -m "Add monthly habit recurrence pattern"
git commit -m "Fix streak calculation for bi-weekly habits"
git commit -m "Update color scheme to darker charcoal"
```

### Check What Changed Before Committing
```bash
git status              # See which files changed
git diff                # See exact changes
```

### View Commit History
```bash
git log --oneline       # See all commits
```

### Undo Changes (if needed)
```bash
git restore app.js      # Discard changes to a file (before committing)
git reset HEAD~1        # Undo last commit (keeps changes)
```

---

## Troubleshooting

### "fatal: not a git repository"
- You're not in the right directory
- Run: `cd "/Users/aleraymo/Documents/Obsidian Vault/Calendar Habit Tracker"`

### "Permission denied (publickey)"
- GitHub needs authentication
- Use HTTPS (not SSH) for the remote URL
- When pushing, enter your GitHub username and **personal access token** (not password)
- [Create a token here](https://github.com/settings/tokens)

### "Updates were rejected"
- Someone else (or you from another computer) pushed changes
- Run: `git pull` first, then `git push`

### GitHub Pages not updating
- Check **Settings → Pages** shows "Your site is live"
- Wait 2-3 minutes after pushing
- Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Data not syncing between devices
- **Expected behavior!** localStorage is device-specific
- Each device has its own data
- (Supabase will solve this in a future update - it's in the `future-features/` folder)

---

## Checking Your Deployment Status

### View in GitHub
- Go to your repository
- Click **Actions** tab to see deployment progress
- Green checkmark = deployed successfully
- Red X = deployment failed (check logs)

### Test Live Site
- Visit: `https://YOUR_USERNAME.github.io/habit-tracker-2026/`
- Open browser console (F12) to check for errors
- Test on mobile Safari as well

---

## What's Next?

Once deployed, you can:
1. ✅ Use on iPhone by adding to home screen
2. ✅ Track habits daily
3. ✅ Add features via Git commits
4. ✅ Review your weekly/monthly progress

**Future enhancements** (saved in `future-features/`):
- Supabase integration for cross-device sync
- Google authentication
- Cloud backup of all your data

---

## Quick Reference

```bash
# Daily workflow
cd "/Users/aleraymo/Documents/Obsidian Vault/Calendar Habit Tracker"
git add .
git commit -m "Your change description"
git push

# Check status
git status
git log --oneline

# Your live URL
https://YOUR_USERNAME.github.io/habit-tracker-2026/
```

---

**Need help?** Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
