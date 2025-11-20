# InkBit - React + Express Setup Guide

## Project Structure Overview

```
inkbit007.github.io/
├── client/                          # React frontend (Vite)
│   ├── src/
│   │   ├── main.jsx                 # React entry point
│   │   ├── App.jsx                  # Router & layout
│   │   ├── App.css                  # App styles
│   │   ├── AuthContext.jsx          # Global auth state
│   │   ├── api.js                   # Axios API client
│   │   ├── components/
│   │   │   ├── Explore.jsx          # Demo component
│   │   │   └── Explore.css
│   │   └── index.css                # Global styles
│   ├── index.html                   # Vite entry point
│   ├── package.json
│   ├── vite.config.js               # Vite config with API proxy
│   └── README.md
│
├── public/                          # Legacy static pages & admin
│   ├── landing/                     # Landing pages (explore, achievements, etc.)
│   ├── admin/                       # Admin dashboard (protected)
│   ├── index.html
│   ├── script.js
│   └── styles.css
│
├── routes/                          # Express API routes
│   ├── users.js                     # Auth & user management
│   └── collections.js               # Collections CRUD
│
├── models/                          # MongoDB schemas
│   ├── user.js
│   └── collection.js
│
├── middleware/                      # Express middleware
│   ├── auth.js                      # Basic Auth (admin)
│   └── errorHandler.js
│
├── __tests__/                       # Jest tests
│   └── api.test.js
│
├── app.js                           # Express server (entry point)
├── passport-config.js               # Google OAuth config
├── package.json                     # Root scripts & dependencies
└── SETUP_GUIDE.md                   # This file
```

## Installation & Setup

### 1. Install Root Dependencies
```bash
npm install
```

### 2. Install Client Dependencies
```bash
npm run client:install
# or manually: cd client && npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/mywebapp
SESSION_SECRET=your_session_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## Running the Application

### Development Mode (Both Servers)
```bash
npm run dev:all
```
This runs both the Express server (`nodemon app.js`) and Vite dev server (`cd client && npm run dev`) concurrently.
- Express API: `http://localhost:3000`
- React Dev Server: `http://localhost:5173`
- API requests from React automatically proxy to Express (configured in `vite.config.js`)

### Express Server Only
```bash
npm run dev
# or for production: npm start
```

### React Dev Server Only
```bash
npm run client:dev
```

### Build for Production
```bash
npm run build
# or: npm run client:build (builds React only)
```
This creates `client/dist/` with optimized React build.

### Run Production Build
```bash
npm run start:prod
# Builds React, then starts Express server
# Open http://localhost:3000 to access the React app served by Express
```

## Frontend Architecture

### React App Structure
- **`App.jsx`**: Main router with navbar and layout
- **`AuthContext.jsx`**: Global auth state (login, signup, logout, user profile)
- **`api.js`**: Centralized Axios client with pre-configured endpoints
- **Components**: Individual page components (Explore, Collections, Achievements, etc.)

### Pages to Migrate (From Static HTML)
- `Explore` → `src/components/Explore.jsx` ✅ (done)
- `Collections` → `src/components/Collections.jsx` (pending)
- `Achievements` → `src/components/Achievements.jsx` (pending)
- `MyProfile` → `src/components/MyProfile.jsx` (pending)
- `Admin` → `src/components/Admin.jsx` (pending)

### Using Auth in Components
```jsx
import { useAuth } from '../AuthContext';

export function MyComponent() {
  const { user, login, logout } = useAuth();
  
  if (!user) return <p>Please log in</p>;
  return <p>Welcome, {user.name}</p>;
}
```

### Using API in Components
```jsx
import { collectionsAPI, authAPI } from '../api';

export function MyComponent() {
  useEffect(() => {
    collectionsAPI.getAll().then(setCollections);
  }, []);
}
```

## Backend Architecture

### API Endpoints

#### Users
- `POST /api/users/signup` - Create new user
- `POST /api/users/login` - User login (session-based)
- `POST /api/users/logout` - User logout
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/:id` - Update user profile

#### Collections
- `GET /api/collections/public` - Get all public collections (paginated)
- `GET /api/collections/` - Get user's collections
- `POST /api/collections` - Create new collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection
- `POST /api/collections/:id/report` - Report collection as inappropriate
- `GET /api/collections/admin/reports` - Get moderation reports (admin only)
- `PUT /api/collections/:id/moderate` - Moderate collection (admin only)

### Security Features
- **Helmet**: Sets HTTP security headers
- **CORS**: Enables cross-origin requests (configured for development)
- **Rate Limiting**: Basic rate limiting (100 requests per minute)
- **bcrypt**: Password hashing
- **Session**: Express sessions for authenticated users
- **Passport**: Google OAuth integration

### Database Models
- **User**: email, name, password (hashed), profile fields
- **Collection**: title, description, items, owner, status (active/flagged/removed), reports

## Development Workflow

### Adding a New Page Component
1. Create `src/components/NewPage.jsx`:
   ```jsx
   import { useAuth } from '../AuthContext';
   import './NewPage.css';
   
   export default function NewPage() {
     const { user } = useAuth();
     return <div>New Page Content</div>;
   }
   ```

2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/new-page" element={<NewPage />} />
   ```

3. Link from navbar or other components:
   ```jsx
   <Link to="/new-page">New Page</Link>
   ```

### Adding a New API Endpoint
1. Create route file in `routes/newRoutes.js`
2. Mount in `app.js`: `app.use('/api/new', newRoutes)`
3. Add API methods to `client/src/api.js`:
   ```js
   export const newAPI = {
     getAll: () => api.get('/new'),
     create: (data) => api.post('/new', data),
   };
   ```

## Testing

### Run Backend Tests
```bash
npm test
```
(Jest + Supertest for API endpoints)

### Add React Component Tests (TODO)
Set up Vitest or Jest + React Testing Library for component testing.

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Set in `.env` or server environment:
```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mywebapp
SESSION_SECRET=strong_random_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://yoursite.com/auth/google/callback
```

### Start Production Server
```bash
npm start
```
- React build (`client/dist/`) served by Express at `/`
- API routes available at `/api/*`
- Legacy static pages available at `/landing/*`

## Troubleshooting

### React App Not Loading
- Ensure `npm run client:build` succeeded and `client/dist/` exists
- Check Express is serving static files correctly (logs should show "Server running on...")
- Verify API routes are not conflicting (they should be under `/api/`)

### API Not Responding
- Verify MongoDB connection (check logs for "MongoDB connected")
- Check `/health` endpoint: `curl http://localhost:3000/health`
- Ensure Vite proxy is configured correctly (check `vite.config.js`)

### Port Already in Use
- Change port in `.env` or command: `PORT=3001 npm start`
- Or kill process: `lsof -ti:3000 | xargs kill -9`

## Next Steps

1. **Migrate Remaining Pages**: Convert static HTML pages to React components
2. **Harden Authentication**: Replace Basic Auth with JWT or enhanced session security
3. **Add Tests**: React component tests + integration tests
4. **Improve Error Handling**: User-friendly error messages
5. **Add Dark Mode**: CSS variable-based theme switching
6. **Deploy**: Choose hosting (Vercel, Railway, Heroku, etc.)

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express Documentation](https://expressjs.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [Axios Documentation](https://axios-http.com)
