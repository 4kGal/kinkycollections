import React, { createContext, useEffect, useReducer, useState } from 'react'
import jwtDecode from 'jwt-decode'
import {
  UPDATE_FAVORITE,
  LOGOUT,
  SEARCH_RESULTS,
  UPDATE_USER,
  LOGIN
} from '../utils/constants'

export const AuthContext = createContext()

const initialState = {
  user: null,
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
      localStorage.setItem('user', JSON.stringify(action.payload))
      return {
        ...state,
        user: {
          ...action.payload,
          isAdmin:
            jwtDecode(action.payload?.userRoles)?.Role === 'Admin' &&
            action.payload?.userRoles === process.env.REACT_APP_ADMIN_TOKEN
        }
      }
    case LOGOUT:
      return { ...state, user: null }
    case SEARCH_RESULTS:
      return { ...state, searchResults: action.payload }
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
    if (user !== null) {
      const updatedUser = ({}, user)

      if (Object.hasOwn(user, 'hideUnderage')) {
        updatedUser.hideUnderage = user.hideUnderage
      } else {
        updatedUser.hideUnderage = false
      }

      dispatch({ type: LOGIN, payload: user })
    }
  }, [])

  // const authenticate = async (isLogin, email, password, username) => {
  //   // authenticateUser(isLogin, email, password, username)
  //   const response = await fetch(`/api/user/${isLogin ? 'login' : 'signup'}/`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       ...(email.length > 0 && { email: email.toLowerCase() }),
  //       password,
  //       username: username.toLowerCase()
  //     })
  //   })
  //   const json = await response.json()

  //   if (response.ok) {
  //     localStorage.setItem('user', JSON.stringify(json))

  //     // updateLocalUser(json)
  //     dispatch({ type: LOGIN, payload: json })
  //     //  navigate('/')
  //   }
  // }

  const handleLogout = () => {
    localStorage.removeItem('user')
    dispatch({ type: LOGOUT })
  }

  const updateUserSettings = async (username, hideUnderage) => {
    const response = await fetch(`/api/user/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        hideUnderage
      })
    })
    const json = await response.json()
    // if (!response.ok) {
    //   setError(json.error)
    // }
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(json))
    }
  }

  const updateVideoAdmin = async (collection, key, value, _id) => {
    // if (!isAdmin()) {
    //   return
    // }
    const response = await fetch(`/api/videos/${collection}/${_id}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        value,
        userRole: state?.user.userRoles
      })
    })
    const json = await response.json()

    // if (!response.ok) {
    //   setError(json.error)
    // }
    if (response.ok) {
      window.location.reload()
    }
  }

  const deleteVideoAdmin = async (collection, _id) => {
    fetch(`/api/videos/${collection}/${_id}`, { method: 'DELETE' })
      .then(async (response) => {
        const json = await response.json()

        // if (!response.ok) {
        //   setError(json.error)
        // }
        if (response.ok) {
          window.location.reload()
          console.log('delete successful')
        }
      })
      .catch((error) => {
        console.error('There was an error deleting!', error)
      })
  }

  const updateLocalUser = (newUser) => {
    const { Role } = jwtDecode(newUser?.userRoles)

    console.log('setting user in updateLocalUser', {
      ...newUser,
      isAdmin:
        Role === 'Admin' &&
        newUser?.userRoles === process.env.REACT_APP_ADMIN_TOKEN
    })

    dispatch({
      type: UPDATE_USER,
      payload: {
        ...newUser,
        isAdmin:
          Role === 'Admin' &&
          newUser?.userRoles === process.env.REACT_APP_ADMIN_TOKEN
      }
    })

    // setState({
    //   user: newUser,
    //   isAdmin:
    //     Role === 'Admin' &&
    //     newUser?.userRoles === process.env.REACT_APP_ADMIN_TOKEN
    // })
  }

  // const updateFavorite = async (favorite) => {
  //   const { user } = state
  //   const { userRoles, username } = user
  //   const response = await fetch(`/api/user/favorites/`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       username: username?.toLowerCase(),
  //       userRoles,
  //       favorite
  //     })
  //   })
  //   const json = await response.json()
  //   if (response.ok) {
  //     console.log(json)
  //     localStorage.setItem('user', JSON.stringify(json))

  //     dispatch({ type: UPDATE_FAVORITE, payload: json })
  //   }
  // }

  const handleDisplayAdminSwitch = () => {
    setDisplayAdminControls((prevValue) => !prevValue)
  }

  return (
    <AuthContext.Provider
      value={{
        dispatch,
        updateLocalUser,
        updateVideoAdmin,
        deleteVideoAdmin,
        updateUserSettings,
        displayAdminControls,
        handleDisplayAdminSwitch,
        handleLogout,
        // ...orgState,
        ...state
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
