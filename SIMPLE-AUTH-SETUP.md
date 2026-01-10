# Simple Authentication Setup (5 minutes)

Quick setup guide to enable email/password authentication and cloud sync.

---

## Step 1: Run Database Schema (1 minute)

1. Go to your Supabase project: https://supabase.com/dashboard/project/umnzhtbbvseiwldkoeoq
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `supabase-schema.sql`
5. Paste into the editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see: ✅ "Success. No rows returned"

---

## Step 2: Enable Email Auth (30 seconds)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Email** in the list
3. Make sure **"Enable Email provider"** is toggled ON
4. **Confirm email** can be OFF for testing (turn ON for production)
5. Click **Save** (if needed)

---

## Step 3: Test It!

1. Save all your files
2. Open `index.html` in your browser
3. You should see the sign-in screen
4. Click **"Create Account"**
5. Enter any email and password (min 6 characters)
6. Click **"Sign In"** with same credentials
7. Your app should load! 🎉

---

## How It Works

### Sign Up (First Time)
1. Click "Create Account"
2. Enter email: `your@email.com`
3. Enter password: `password123` (min 6 chars)
4. Message appears: "Account created! Check your email..."
5. **Note:** If email confirmation is OFF, you can sign in immediately

### Sign In (Every Time After)
1. Enter same email/password
2. Click "Sign In"
3. App loads with your data

### Cross-Device Sync
- Sign in on multiple devices with same email/password
- Your habits sync automatically!
- Check off a habit on iPhone → appears on computer instantly

---

## What's Synced

✅ **All habit completions** - Every checkbox state
✅ **Across all dates** - Past, present, future
✅ **Real-time** - Changes sync within seconds
✅ **Offline-first** - Works without internet, syncs when back online

---

## Troubleshooting

### "Failed to sign in"
- Make sure you created an account first (click "Create Account")
- Check password is at least 6 characters
- Try different email if one isn't working

### "Account created" but can't sign in
- In Supabase dashboard: **Authentication** → **Providers** → **Email**
- Turn OFF "Confirm email"
- Try signing in again

### Data not syncing
- Make sure you ran the SQL schema (Step 1)
- Check browser console (F12) for errors
- Verify you're signed in (door icon in header)

### "RLS policy violation"
- The SQL schema didn't run properly
- Go back to Step 1 and re-run it

---

## Next Steps

Once authentication works:

1. ✅ Use on your iPhone (already deployed!)
2. ✅ Sign in with same email/password
3. ✅ Data syncs between devices
4. ✅ Add more features via Git

**Your live app:** https://alexis-raymond.github.io/habit-tracker-2026/

---

## Security Notes

✅ Passwords are encrypted by Supabase
✅ Each user can only see their own data
✅ No passwords stored in your code
✅ Industry-standard security (same as used by major apps)

---

**Questions?** Check the Supabase docs: https://supabase.com/docs/guides/auth
