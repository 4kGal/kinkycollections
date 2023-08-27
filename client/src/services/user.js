import { makeRequest } from './makeRequest'
import { isEmpty } from 'lodash'

export function authenticateUser({ isLoginPage, email, password, username }) {
  return makeRequest(`/api/user/${isLoginPage ? 'login' : 'signup'}/`, {
    method: 'POST',
    data: {
      ...(email.length > 0 && { email: email.toLowerCase() }),
      password,
      username: username.toLowerCase()
    }
  })
}
export function updateUserSettings(params) {
  if (isEmpty(params?.username)) return
  return makeRequest(`/api/user/update`, {
    method: 'PUT',
    data: params
  })
}

export function updateFavorites(username, userRoles, favorite) {
  console.log(username, userRoles, favorite)
  if (isEmpty(username)) return
  return makeRequest(`/api/user/favorites/`, {
    method: 'PUT',
    data: { username: username.toLowerCase(), userRoles, favorite }
  })
}
