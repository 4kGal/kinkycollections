import { isEmpty } from 'lodash'
import { makeRequest } from './makeRequest'

export function createComment({ collection, _id, message, parentId, user }) {
  if (isEmpty(user)) return
  return makeRequest(`/api/videos/${collection}/${_id}/comment`, {
    method: 'POST',
    data: { message, parentId, user: { username: user.username } }
  })
}
