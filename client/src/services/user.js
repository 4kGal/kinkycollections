import { makeRequest } from './makeRequest'
import { isEmpty } from 'lodash'

export function updateUserSettings(params) {
  if (isEmpty(params?.username)) return
  return makeRequest(`/api/user/update`, {
    method: 'PUT',
    data: params
  })
}
