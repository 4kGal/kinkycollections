import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'
import { LOGIN } from '../utils/constants'
import jwtDecode from 'jwt-decode'

export const useAuthenticator = () => {
  const navigate = useNavigate()

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch, user } = useAuthContext()

  const isAdmin = () => {
    if (user?.roles?.length > 0) {
      const { Role }: { Role: string } = jwtDecode(user.roles)

      return (
        Role === 'Admin' && user.roles === process.env.REACT_APP_ADMIN_TOKEN
      )
    }
    return false
  }
  const authenticate = async (
    isLogin: boolean,
    email: string,
    password: string,
    username: string
  ) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch(`/api/user/${isLogin ? 'login' : 'signup'}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(email.length > 0 && { email: email.toLowerCase() }),
        password,
        username: username.toLowerCase()
      })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(json))

      dispatch({ type: LOGIN, payload: json })
      setIsLoading(false)
      navigate('/')
    }
  }

  const updateUserSettings = async (username: string, underage: boolean) => {
    const response = await fetch(`/api/user/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        underage
      })
    })
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(json))
    }
  }

  return { authenticate, updateUserSettings, isAdmin, isLoading, error }
}
