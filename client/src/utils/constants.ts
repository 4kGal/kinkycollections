export const moviesPerPage = 10

export const MAINSTREAM_BB_URL = '/mainstreamBB'
export const AMATEUR_BB_URL = '/amateurBB'

export const AVAILABLE_DECADES = 'AVAILABLE_DECADES'
export const MIN_DECADE = 'MIN_DECADE'
export const AVAILABLE_ACTRESSES = 'AVAILABLE_ACTRESSES'
export const AVAILABLE_TAGS = 'AVAILABLE_TAGS'
export const UPDATE_FAVORITE = 'UPDATE_FAVORITE'
export const LOGOUT = 'LOGOUT'
export const SEARCH_RESULTS = 'SEARCH_RESULTS'
export const FILTER_DECADES = 'FILTER_DECADES'
export const HIDE_UNDERAGE = 'HIDE_UNDERAGE'
export const SORT_BY = 'SORT_BY'
export const SELECTED_ACTRESSES = 'SELECTED_ACTRESSES'
export const LOGIN = 'LOGIN'
export const SHOW_ADMIN_CONTROLS = 'SHOW_ADMIN_CONTROLS'
export const RANDOMIZE = 'RANDOMIZE'

const prod = {
  url: {
    API_URL: 'https://kinkycollections.net:443'
  }
}
const dev = {
  url: {
    API_URL: 'http://localhost:1337'
  }
}
export const config = process.env.NODE_ENV === 'development' ? dev : prod
