import React, { createContext, useEffect, useReducer, useState } from 'react'
import jwtDecode from 'jwt-decode'
import { UPDATE_FAVORITE, LOGOUT, UPDATE_USER, LOGIN } from '../utils/constants'

export const AuthContext = createContext()

const initialState = {
  user: null,
  isAdmin: false,
  searchResults: [],
  authError: null,
  authLoading: false,
  likes: []
}
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case UPDATE_USER:
    case UPDATE_FAVORITE:
      action.payload &&
        localStorage.setItem('user', JSON.stringify(action.payload))
      return {
        ...state,
        user: {
          ...action.payload
        },
        isAdmin:
          localStorage.getItem('user') &&
          localStorage.getItem('user') !== 'null'
            ? jwtDecode(action.payload?.userRoles)?.Role === 'Admin' &&
              action.payload?.userRoles === process.env.REACT_APP_ADMIN_TOKEN
            : false
      }
    case LOGOUT:
      return { ...state, user: null }
    default:
      return state
  }
}
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })

  const [displayAdminControls, setDisplayAdminControls] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      const updatedUser = ({}, user)

      if (Object.hasOwn(user, 'hideUnderage')) {
        updatedUser.hideUnderage = user.hideUnderage
      } else {
        updatedUser.hideUnderage = false
      }
    }
    dispatch({ type: LOGIN, payload: user })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    dispatch({ type: LOGOUT, payload: null })
  }

  // const updateVideoAdmin = async (collection, key, value, _id) => {
  //   // if (!isAdmin()) {
  //   //   return
  //   // }
  //   const response = await fetch(`/api/videos/${collection}/${_id}/update`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       key,
  //       value,
  //       userRole: state?.user.userRoles
  //     })
  //   })
  //   const json = await response.json()

  //   // if (!response.ok) {
  //   //   setError(json.error)
  //   // }
  //   if (response.ok) {
  //     window.location.reload()
  //   }
  // }

  // const deleteVideoAdmin = async (collection, _id) => {
  //   fetch(`/api/videos/${collection}/${_id}`, { method: 'DELETE' })
  //     .then(async (response) => {
  //       const json = await response.json()

  //       // if (!response.ok) {
  //       //   setError(json.error)
  //       // }
  //       if (response.ok) {
  //         window.location.reload()
  //         console.log('delete successful')
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('There was an error deleting!', error)
  //     })
  // }

  const handleDisplayAdminSwitch = () => {
    setDisplayAdminControls((prevValue) => !prevValue)
  }

  return (
    <AuthContext.Provider
      value={{
        dispatch,
        // updateVideoAdmin,
        // deleteVideoAdmin,
        displayAdminControls,
        handleDisplayAdminSwitch,
        handleLogout,
        ...state
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
