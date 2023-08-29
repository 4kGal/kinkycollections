import { makeRequest } from './makeRequest'
import { isEmpty } from 'lodash'

export function authenticateUser({ isLoginPage, email, password, username }) {
  return makeRequest(`/api/user/${isLoginPage ? 'login' : 'signup'}/`, {
    method: 'POST',
    data: {
      ...(email.length > 0 && { email: email.toLowerCase() }),
      password,
      username: username?.toLowerCase()
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

export function updateUserEmail({ username, email }) {
  if (isEmpty(username) || isEmpty(email)) return
  return makeRequest(`/api/user/updateEmail`, {
    method: 'PUT',
    data: { username: username?.toLowerCase(), email: email?.toLowerCase() }
  })
}

export function updateFavorites(username, userRoles, favorite) {
  if (isEmpty(username)) return
  return makeRequest(`/api/user/favorites/`, {
    method: 'PUT',
    data: { username: username?.toLowerCase(), userRoles, favorite }
  })
}

export function updateVideoAdmin({ collection, _id, key, value, user }) {
  return makeRequest(`/api/videos/${collection}/${_id}/update`, {
    method: 'PUT',
    data: {
      key,
      value,
      userRole: user.userRoles
    }
  })
}
export function deleteVideoAdmin(collection, _id) {
  return makeRequest(`/api/videos/${collection}/${_id}`, {
    method: 'DELETE'
  })
}
