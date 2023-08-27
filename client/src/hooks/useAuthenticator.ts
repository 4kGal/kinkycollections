import { useState } from 'react'
import { useAuthContext } from './'
import { useNavigate } from 'react-router-dom'

export const useAuthenticator = () => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, updateLocalUser } = useAuthContext()

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

      updateLocalUser(json)
      // dispatch({ type: LOGIN, payload: json })
      setIsLoading(false)
      navigate('/')
    }
  }

  const updateUserSettings = async (
    username: string,
    hideUnderage: boolean
  ) => {
    const response = await fetch(`/api/user/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        hideUnderage
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

  const updateVideoAdmin = async (
    collection: string,
    key: string,
    value: unknown,
    _id: string
  ) => {
    // if (!isAdmin()) {
    //   return
    // }
    const response = await fetch(`/api/videos/${collection}/${_id}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        value,
        userRole: user.userRoles
      })
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      window.location.reload()
    }
  }

  const deleteVideoAdmin = async (collection: string, _id: string) => {
    fetch(`/api/videos/${collection}/${_id}`, { method: 'DELETE' })
      .then(async (response) => {
        const json = await response.json()

        if (!response.ok) {
          setError(json.error)
        }
        if (response.ok) {
          window.location.reload()
          console.log('delete successful')
        }
      })
      .catch((error) => {
        console.error('There was an error deleting!', error)
      })
  }
  return {
    authenticate,
    updateUserSettings,
    isLoading,
    updateVideoAdmin,
    deleteVideoAdmin,
    error
  }
}
