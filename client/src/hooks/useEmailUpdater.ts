import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'
import { LOGIN } from '../utils/constants'

export const useEmailUpdater = () => {
  const navigate = useNavigate()

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const updateEmail = async (email: string, username: string, from: string) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL ?? ''}/api/user/updateEmail/`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          username: username.toLowerCase()
        })
      }
    )
    const json = await response.json()
    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(json))

      dispatch({ type: LOGIN, payload: json })
      setIsLoading(false)
      navigate(from)
    }
  }

  return { updateEmail, isLoading, error }
}
