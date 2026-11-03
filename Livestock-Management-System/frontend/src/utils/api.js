const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

export const getAuthToken = () => localStorage.getItem('livestock_token')

export const saveAuth = (token, user) => {
  localStorage.setItem('livestock_token', token)
  localStorage.setItem('livestock_current_user', JSON.stringify(user))
}

export const clearAuth = () => {
  localStorage.removeItem('livestock_token')
  localStorage.removeItem('livestock_current_user')
}

export const apiRequest = async (path, options = {}) => {
  const headers = new Headers(options.headers)
  const token = getAuthToken()

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    })
  } catch {
    throw new Error('Cannot reach the API. Ensure the backend and MongoDB are running.')
  }

  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401 && getAuthToken()) {
      clearAuth()
      window.dispatchEvent(new Event('livestock:unauthorized'))
    }

    const validationMessage = result.errors
      ?.map((item) => item.msg)
      .filter(Boolean)
      .join(', ')
    throw new Error(validationMessage || result.message || 'The request could not be completed.')
  }

  return result
}
