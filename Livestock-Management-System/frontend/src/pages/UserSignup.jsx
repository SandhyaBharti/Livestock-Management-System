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

const saveUser = (user) => {
  const users = getUsers()
  users.push(user)
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export default function UserSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    // Check if user already exists
    const users = getUsers()
    const existingUser = users.find(user => user.email === formData.email)
    
    if (existingUser) {
      setError('Email already exists. Please login instead.')
      return
    }

    // Save new user
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    }

    saveUser(newUser)
    
    // Auto login after signup
    localStorage.setItem('livestock_current_user', JSON.stringify(newUser))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">User Signup</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-destructive/20 border border-destructive rounded-md text-destructive text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
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
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors mb-4"
          >
            Sign Up
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/user-login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
          <Link to="/admin-login" className="block mt-2 text-primary hover:underline text-sm">
            Login as Admin
          </Link>
        </div>
      </div>
    </div>
  )
}


