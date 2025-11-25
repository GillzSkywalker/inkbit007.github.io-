# Inkbit Deployment Guide

Deploy your Inkbit app to Railway (recommended) with a live API.

## Quick Deploy to Railway

### Step 1: Sign Up & Connect GitHub
1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select your `inkbit007.github.io-` repository

### Step 2: Configure Environment Variables
In Railway dashboard, set these variables:

```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/inkbit
SESSION_SECRET=your_random_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_API_URL=https://your-railway-domain.railway.app/api
```

#### Get MongoDB Atlas URL:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/inkbit`

#### Get Google OAuth credentials:
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web application)
5. Set authorized redirect URIs: `https://your-railway-domain.railway.app/auth/google/callback`
6. Copy Client ID and Secret

### Step 3: Deploy
1. In Railway dashboard, click "Deploy"
2. Watch the build logs
3. Once deployed, click "View Domain" to see your live app

### Step 4: Test the API
Your API is now live at: `https://your-railway-domain.railway.app/api`

Test with:
```bash
curl -X GET https://your-railway-domain.railway.app/health
```

### Step 5: Update Frontend
The React frontend will automatically connect to the API (configured via VITE_API_URL).

---

## Alternative: Heroku Deployment

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Run:
```bash
heroku login
heroku create your-app-name
heroku config:set NODE_ENV=production MONGO_URI=... SESSION_SECRET=...
git push heroku main
```

---

## Troubleshooting

### API Not Connecting
- Check `VITE_API_URL` is set correctly in Railway
- Verify MongoDB connection string
- Check browser DevTools Network tab for 404/500 errors

### Build Fails
- Ensure `npm run client:build` succeeds locally
- Check package.json has all dependencies

### CORS Errors
- The Express backend has CORS enabled for all origins
- If you need stricter CORS, update `app.js`:
```javascript
app.use(cors({ origin: 'https://your-frontend-domain.com', credentials: true }))
```

---

## Local Testing

Before deploying, test locally:

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

Open: http://localhost:5173

---

## Production Build

To build for production locally:
```bash
npm run client:build
npm start
```

Then open: http://localhost:3000
