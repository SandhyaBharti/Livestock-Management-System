import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../utils/api'

export default function useApiCollection(endpoint) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const { data } = await apiRequest(endpoint)
      setItems(data)
      setError('')
      return data
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    let active = true
    apiRequest(endpoint)
      .then(({ data }) => {
        if (active) {
          setItems(data)
          setError('')
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [endpoint])

  const create = async (value) => {
    try {
      const { data } = await apiRequest(endpoint, { method: 'POST', body: value })
      setItems((current) => [...current, data])
      setError('')
      return data
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }

  const update = async (id, value) => {
    try {
      const { data } = await apiRequest(`${endpoint}/${id}`, { method: 'PUT', body: value })
      setItems((current) => current.map((item) => (item._id === id ? data : item)))
      setError('')
      return data
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }

  const remove = async (id) => {
    try {
      await apiRequest(`${endpoint}/${id}`, { method: 'DELETE' })
      setItems((current) => current.filter((item) => item._id !== id))
      setError('')
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }

  return { items, loading, error, setError, create, update, remove, refresh }
}
