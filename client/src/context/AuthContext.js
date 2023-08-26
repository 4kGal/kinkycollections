import React, { createContext, useEffect, useReducer, useState } from 'react'
import jwtDecode from 'jwt-decode'
import {
  UPDATE_FAVORITE,
  LOGOUT,
  SEARCH_RESULTS,
  LOGIN
} from '../utils/constants'

export const AuthContext = createContext()

const initialState = {
  user: null,
  searchResults: [],
  likes: []
}
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case UPDATE_FAVORITE:
      return { ...state, user: action.payload }
    case LOGOUT:
      return { ...state, user: null }
    case SEARCH_RESULTS:
      return { ...state, searchResults: action.payload }
    default:
      return state
  }
}
export const AuthContextProvider = ({ children }) => {
  const [test, dispatch] = useReducer(authReducer, {
    user: null
  })
  const [state, setState] = useState({
    user: null,
    displayAdminControls: false,
    hideUnderage: true
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user !== null) {
      const { Role } = jwtDecode(user?.userRoles)
      const updatedUser = ({}, user)

      if (Object.hasOwn(user, 'hideUnderage')) {
        updatedUser.hideUnderage = user.hideUnderage
      } else {
        updatedUser.hideUnderage = false
      }
      setState({
        user: updatedUser,
        isAdmin:
          Role === 'Admin' &&
          updatedUser?.userRoles === process.env.REACT_APP_ADMIN_TOKEN
      })
    }
  }, [])

  const updateLocalUser = (newUser) => {
    const { Role } = jwtDecode(newUser?.userRoles)

    setState({
      user: newUser,
      isAdmin:
        Role === 'Admin' &&
        newUser?.userRoles === process.env.REACT_APP_ADMIN_TOKEN
    })
  }

  const setDisplayAdminControls = () => {
    setState({
      ...state,
      displayAdminControls: !state.displayAdminControls
    })
  }

  return (
    <AuthContext.Provider
      value={{
        dispatch,
        updateLocalUser,
        handleDisplayAdminSwitch: setDisplayAdminControls,
        ...state
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
