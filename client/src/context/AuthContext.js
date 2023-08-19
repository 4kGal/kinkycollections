import React, { createContext, useEffect, useReducer } from 'react'
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
  RANDOMIZE
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
  randomize: false
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
      console.log(action?.payload)
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
    case RANDOMIZE:
      return { ...state, randomize: action.payload }
    default:
      return state
  }
}
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user !== null) {
      dispatch({ type: LOGIN, payload: user })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
