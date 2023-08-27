import { makeRequest } from './makeRequest'
import { isEmpty } from 'lodash'
import { useAuthContext } from '../hooks'

export function updateUserSettings(params) {
  if (isEmpty(params?.username)) return
  return makeRequest(`/api/user/update`, {
    method: 'PUT',
    data: params
  })
}

export function updateFavorites(username, userRoles, favorite) {
  if (isEmpty(username)) return
  return makeRequest(`/api/user/favorites/`, {
    method: 'PUT',
    data: { username: username.toLowerCase(), userRoles, favorite }
  })
}
