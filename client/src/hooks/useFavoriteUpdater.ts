import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { UPDATE_FAVORITE } from '../utils/constants'

export const useFavoriteUpdater = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const updateFavorite = async (username: string, favorite: string) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch(
      `/api/user/favorites/`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.toLowerCase(),
          favorite
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

      dispatch({ type: UPDATE_FAVORITE, payload: json })
      setIsLoading(false)
    }
  }

  return { updateFavorite, isLoading, error }
}
