import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const USERS_STORAGE_KEY = 'livestock_users'

const getUsers = () => {
  const saved = localStorage.getItem(USERS_STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Error parsing users from localStorage:', e)
    }
  }
  return []
}

export default function UserLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const users = getUsers()
    const user = users.find(u => u.email === formData.email)

    if (!user) {
      setError('Email not found. Please sign up first.')
      return
    }

    if (user.password !== formData.password) {
      setError('Invalid password')
      return
    }

    // Store current user session
    localStorage.setItem('livestock_current_user', JSON.stringify(user))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">User Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-destructive/20 border border-destructive rounded-md text-destructive text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-lg font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors mb-4"
          >
            Login
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground mb-2">
            Don't have an account?{' '}
            <Link to="/user-signup" className="text-primary hover:underline">
              Sign up here
            </Link>
          </p>
          <Link to="/admin-login" className="text-primary hover:underline text-sm">
            Login as Admin
          </Link>
        </div>
      </div>
    </div>
  )
}