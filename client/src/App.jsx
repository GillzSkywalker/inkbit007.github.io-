import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Explore from './components/Explore'
import Signup from './components/Signup'
import Login from './components/Login'
import './App.css'

function Layout({ children }) {
  const { user } = useAuth()
  return (
    <div className="layout">
      <nav className="navbar">
        <h1 className="logo">Inkbit</h1>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/explore">Explore</a></li>
          <li><a href="/my-collections">Collections</a></li>
          <li><a href="/achievements">Achievements</a></li>
          {user ? (
            <>
              <li><a href="/my-profile">Profile</a></li>
              <li><a href="/logout">Logout</a></li>
            </>
          ) : (
            <li><a href="/login">Login</a></li>
          )}
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  )
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<div className="home"><h1>Welcome to Inkbit</h1><p>React frontend connected to Express API</p></div>} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AppContent />
        </Layout>
      </Router>
    </AuthProvider>
  )
}
