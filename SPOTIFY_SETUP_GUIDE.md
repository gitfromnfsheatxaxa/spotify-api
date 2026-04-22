# Spotify Developer Dashboard Setup Guide

## Fixing "redirect_uri: Not matching configuration" Error

### ⚠️ CURRENT ISSUE
You have the production URL configured, but you're running locally. Spotify requires **exact match**.

### Step 1: Go to Spotify Developer Dashboard
1. Visit: https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click on your app (should show the app with Client ID: `03b6aa351...`)

### Step 2: Edit Redirect URIs
1. Click "Edit Settings" on your app
2. In the "Redirect URIs" field, add **BOTH** of these URLs:

**For Local Development (ADD THIS):**
```
http://127.0.0.1:3000/api/auth/callback
```

**For Production (Already configured):**
```
https://spotify-api-flax.vercel.app/api/auth/callback
```

3. Click "Add" after each URL
4. Click "Save" at the bottom of the page

### ✅ What You Should Have in Spotify Dashboard:
```
Redirect URIs:
✓ http://127.0.0.1:3000/api/auth/callback
✓ https://spotify-api-flax.vercel.app/api/auth/callback
```

### Important Notes:
- ⚠️ **Spotify requires exact IP address** - Use `127.0.0.1` NOT `localhost`
- ⚠️ **Include the full path** - Must include `/api/auth/callback`
- ⚠️ **No trailing slashes** - Don't add `/` at the end
- ✅ You can add multiple redirect URIs (both local and production)

### Step 3: Verify Your Environment Variables

**For Local Development (.env.local):**
```env
SPOTIFY_CLIENT_ID=03b6aa351bc14aafa73ed55a171e54d6
SPOTIFY_CLIENT_SECRET=15049e66f7d04a79a53e15d569dfc845
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=03b6aa351bc14aafa73ed55a171e54d6
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

**For Production (Vercel Environment Variables):**
```env
SPOTIFY_CLIENT_ID=03b6aa351bc14aafa73ed55a171e54d6
SPOTIFY_CLIENT_SECRET=15049e66f7d04a79a53e15d569dfc845
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=03b6aa351bc14aafa73ed55a171e54d6
NEXT_PUBLIC_APP_URL=https://spotify-api-flax.vercel.app
```

### Step 4: Restart Your Development Server
After updating the redirect URIs in Spotify Dashboard:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test the Authentication
1. Clear your browser cookies for the site
2. Visit: http://127.0.0.1:3000
3. Click "Continue with Spotify"
4. You should now be redirected to Spotify for authorization
5. After approving, you should be redirected back to /panel

### Troubleshooting

**Error: "redirect_uri: Not matching configuration"**
- ✅ Double-check the redirect URI in Spotify Dashboard exactly matches
- ✅ Use `127.0.0.1` not `localhost`
- ✅ Include full path: `/api/auth/callback`
- ✅ No trailing slashes

**Error: "404 Not Found" on callback**
- ✅ Make sure the API route exists at `/api/auth/callback/route.ts`
- ✅ Check that your dev server is running

**Error: "Invalid Client"**
- ✅ Verify your Client ID and Client Secret are correct
- ✅ Make sure they match in both Spotify Dashboard and .env.local

### Quick Reference

| Environment | Redirect URI |
|-------------|--------------|
| Local Dev | `http://127.0.0.1:3000/api/auth/callback` |
| Production | `https://spotify-api-flax.vercel.app/api/auth/callback` |

### Current Configuration Status

Your current setup:
- Client ID: `03b6aa351bc14aafa73ed55a171e54d6` ✓
- Local App URL: `http://127.0.0.1:3000` ✓
- Production App URL: `https://spotify-api-flax.vercel.app` ✓

**Action Required:** Add both redirect URIs to your Spotify Developer Dashboard settings.