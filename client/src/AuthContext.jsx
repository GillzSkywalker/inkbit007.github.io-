import React, { createContext, useState, useEffect } from 'react'
import { authAPI } from './api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authAPI.getCurrentUser()
        setUser(res.data)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    const res = await authAPI.login(email, password)
    setUser(res.data)
    return res.data
  }

  const signup = async (name, email, password) => {
    const res = await authAPI.signup(name, email, password)
    setUser(res.data)
    return res.data
  }

  const logout = async () => {
    await authAPI.logout()
    setUser(null)
  }

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data)
    setUser(res.data)
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
