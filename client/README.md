# Inkbit React Client

Modern React frontend for Inkbit, built with Vite and integrated with Express API.

## Quick Start

### Development
```bash
cd client
npm install
npm run dev
```

- Frontend: http://localhost:5173 (Vite with hot reload)
- API Proxy: `/api` → http://localhost:3000
- Start backend server separately: `npm start` from root

### Build
```bash
npm run build
```

Outputs to `client/dist`.

## Architecture

- **Vite**: Fast dev server and build tool
- **React Router**: Client-side routing
- **Axios**: HTTP client with request/response interceptors
- **AuthContext**: Global auth state management
- **API Layer**: Centralized API client (`src/api.js`)

## Pages

- `/explore` — Browse and add collections (demo component)
- `/my-collections` — View user collections
- `/achievements` — User achievements
- `/my-profile` — User profile and settings
- `/login` — Sign in

## Integration with Express

1. **Development**: Vite proxy forwards `/api` calls to `http://localhost:3000`
2. **Production**: Build React with `npm run build`, then serve from Express:
   - Express static route: `app.use(express.static('client/dist'))`
   - Root route fallback: `app.get('*', (req, res) => res.sendFile('client/dist/index.html'))`

## Environment Variables

Create `.env` in `client/` (optional for dev, since Vite proxy handles API):
```
VITE_API_BASE=http://localhost:3000/api
```

## Adding Components

1. Create component in `src/components/`
2. Add route in `src/App.jsx`
3. Use `useAuth()` hook for auth state or `collectionsAPI` for data

Example:
```jsx
import { useAuth } from '../AuthContext'
import { collectionsAPI } from '../api'

export default function MyComponent() {
  const { user } = useAuth()
  // ...
}
```
