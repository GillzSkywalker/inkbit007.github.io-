import React, { useState } from 'react'
import { useAuth } from '../AuthContext'
import './Signup.css'

export default function Signup() {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!name || !email || !password) return setError('All fields are required')
    if (password !== confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      await signup(name, email, password)
      // On success, redirect to home
      window.location.href = '/'
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error && <div className="auth-error">{error}</div>}
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
        <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm password" type="password" />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
      </form>
    </div>
  )
}
