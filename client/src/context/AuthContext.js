import React, { createContext, useEffect, useReducer, useState } from 'react'
import jwtDecode from 'jwt-decode'
import {
  AVAILABLE_DECADES,
  MIN_DECADE,
  AVAILABLE_ACTRESSES,
  AVAILABLE_TAGS,
  UPDATE_FAVORITE,
  LOGOUT,
  SEARCH_RESULTS,
  FILTER_DECADES,
  HIDE_UNDERAGE,
  SORT_BY,
  SELECTED_ACTRESSES,
  SHOW_ADMIN_CONTROLS,
  LOGIN,
  NUM_OF_VIDEOS_PER_PAGE,
  GALLERY_LENGTH
} from '../utils/constants'
export const AuthContext = createContext()

const initialState = {
  user: null,
  searchResults: [],
  likes: [],
  minDecade: null,
  decadesFilter: [],
  availableDecades: [],
  availableTags: [],
  sortBy: 'newest',
  availableActresses: [],
  selectedActresses: [],
  hideUnderage: true,
  showAdminControls: false,
  numOfVidsPerPage: 9,
  videoLength: 0
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
    case MIN_DECADE:
      return { ...state, minDecade: action.payload }
    case FILTER_DECADES:
      return { ...state, decadesFilter: action.payload }
    case AVAILABLE_DECADES:
      return { ...state, availableDecades: action.payload }
    case AVAILABLE_TAGS:
      return { ...state, availableTags: action.payload }
    case SORT_BY:
      return { ...state, sortBy: action.payload }
    case AVAILABLE_ACTRESSES:
      return { ...state, availableActresses: action.payload }
    case SELECTED_ACTRESSES:
      return { ...state, selectedActresses: action.payload }
    case HIDE_UNDERAGE:
      return { ...state, hideUnderage: action.payload }
    case SHOW_ADMIN_CONTROLS:
      return { ...state, showAdminControls: action.payload }
    case NUM_OF_VIDEOS_PER_PAGE:
      return { ...state, numOfVidsPerPage: action.payload }
    case GALLERY_LENGTH:
      return { ...state, galleryLength: action.payload }
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
      setState({
        user,
        isAdmin:
          Role === 'Admin' &&
          user?.userRoles === process.env.REACT_APP_ADMIN_TOKEN
      })
    }
  }, [])

  const updateUser = (newUser) => {
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

  const setHideUnderageSwitch = () => {
    setState({
      ...state,
      hideUnderage: !state.hideUnderage
    })
  }

  return (
    <AuthContext.Provider
      value={{
        dispatch,
        ...state,
        updateUser,
        handleDisplayAdminSwitch: setDisplayAdminControls,
        handleHideUnderageSwitch: setHideUnderageSwitch
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
