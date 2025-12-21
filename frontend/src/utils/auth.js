// Utility functions for authentication

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('livestock_current_user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (e) {
      console.error('Error parsing current user:', e)
    }
  }
  return null
}

export const isAdmin = () => {
  const user = getCurrentUser()
  return user && user.role === 'admin'
}

export const getUserId = () => {
  const user = getCurrentUser()
  return user ? user.id : null
}


