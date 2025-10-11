# Deployment Guide for Visions Web

This guide will help you deploy your Next.js app to **Vercel** or **Netlify** with your custom domain `www.visions.com.np`.

---

## Prerequisites

1. A GitHub account
2. Your code pushed to a GitHub repository
3. A Vercel or Netlify account (both are free)
4. Your custom domain `www.visions.com.np`

---

## Option A: Deploy to Vercel (Recommended for Next.js)

Vercel is made by the creators of Next.js and offers the best Next.js support.

### Step 1: Push to GitHub

1. Create a new repository on GitHub (e.g., `visions-web`)
2. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/visions-web.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `visions-web` repository
4. Configure your project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./ (root)`
   - Click **"Deploy"**

### Step 3: Add Environment Variables

1. After deployment, go to your project settings
2. Navigate to **Settings → Environment Variables**
3. Add these variables (use the same values for Production, Preview, and Development):

   ```
   AUTH_SECRET=your-generated-secret
   NEXTAUTH_SECRET=your-generated-secret
   NEXTAUTH_URL=https://www.visions.com.np
   AUTH_URL=https://www.visions.com.np
   
   # Optional - only if you want Google login:
   AUTH_GOOGLE_ID=your-google-client-id
   GOOGLE_CLIENT_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Optional - only if you want GitHub login:
   AUTH_GITHUB_ID=your-github-client-id
   GITHUB_CLIENT_ID=your-github-client-id
   AUTH_GITHUB_SECRET=your-github-client-secret
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

   **Generate AUTH_SECRET**: Run this command on your computer:
   ```bash
   openssl rand -base64 32
   ```

4. Click **"Save"** and redeploy

### Step 4: Connect Custom Domain

1. In Vercel project settings, go to **Domains**
2. Add your domain: `www.visions.com.np`
3. Vercel will show you DNS records to add
4. Go to your domain registrar (where you bought visions.com.np)
5. Add the DNS records:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: cname.vercel-dns.com
6. Wait 10-60 minutes for DNS propagation
7. Your site will be live at `www.visions.com.np`!

---

## Option B: Deploy to Netlify

### Step 1: Push to GitHub

Same as Vercel - push your code to GitHub first.

### Step 2: Install Netlify Next.js Plugin

Netlify requires a plugin for Next.js SSR to work properly.

1. Add the plugin to your project:
   ```bash
   npm install --save-dev @netlify/plugin-nextjs
   ```

2. Create `netlify.toml` in your project root:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. Commit and push these changes:
   ```bash
   git add netlify.toml package.json package-lock.json
   git commit -m "Add Netlify configuration"
   git push
   ```

### Step 3: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click **"Add new site" → "Import an existing project"**
3. Choose GitHub and select your `visions-web` repository
4. Netlify will auto-detect the settings from netlify.toml
5. Click **"Deploy site"**

### Step 4: Add Environment Variables

1. Go to **Site settings → Environment variables**
2. Click **"Add a variable"** for each:

   ```
   AUTH_SECRET=your-generated-secret
   NEXTAUTH_SECRET=your-generated-secret
   NEXTAUTH_URL=https://www.visions.com.np
   AUTH_URL=https://www.visions.com.np
   
   # Add OAuth credentials if needed (same as Vercel above)
   ```

3. After adding all variables, click **"Trigger deploy"** to rebuild

### Step 5: Connect Custom Domain

1. Go to **Domain settings → Custom domains**
2. Click **"Add custom domain"**
3. Enter: `www.visions.com.np`
4. Netlify will provide DNS instructions
5. In your domain registrar, add:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: [your-site-name].netlify.app
6. Wait for DNS propagation (10-60 minutes)
7. Enable HTTPS in Netlify (automatic with Let's Encrypt)

---

## OAuth Setup (Optional)

If you want Google or GitHub login, you need to configure OAuth apps:

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Add authorized redirect URIs:
   - For Vercel: `https://www.visions.com.np/api/auth/callback/google`
   - For Netlify: `https://www.visions.com.np/api/auth/callback/google`
6. Copy Client ID and Client Secret to your environment variables

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: Visions Web
   - **Homepage URL**: `https://www.visions.com.np`
   - **Authorization callback URL**: `https://www.visions.com.np/api/auth/callback/github`
4. Click **"Register application"**
5. Copy Client ID and generate a Client Secret
6. Add to your environment variables

---

## Testing Your Deployment

1. Visit your deployed URL (Vercel/Netlify gives you a .vercel.app or .netlify.app URL)
2. Test authentication with credentials:
   - **Admin**: admin@example.com / admin123
   - **User**: user@example.com / user123
3. Once working, set up your custom domain
4. Test at `www.visions.com.np`

---

## Troubleshooting

### Authentication Errors
- Make sure `AUTH_SECRET` is set and at least 32 characters
- Check that all OAuth redirect URLs match your domain exactly

### Build Errors
- Check build logs in Vercel/Netlify dashboard
- Ensure all dependencies are in package.json

### Custom Domain Not Working
- DNS changes take 10-60 minutes (sometimes up to 24 hours)
- Verify DNS records with: `nslookup www.visions.com.np`
- Make sure you're using `www` subdomain, not apex domain

---

## Which Platform Should You Choose?

**Choose Vercel if:**
- ✅ You want the best Next.js performance (made by Next.js creators)
- ✅ You want automatic preview deployments for every git push
- ✅ You prefer simpler configuration

**Choose Netlify if:**
- ✅ You're already familiar with Netlify
- ✅ You want more control over build settings
- ✅ You need Netlify-specific features

Both are excellent choices and support all your app's features!
