import { isEmpty } from 'lodash'
import { makeRequest } from './makeRequest'

export function createComment({ collection, _id, message, parentId, user }) {
  if (isEmpty(user)) return
  return makeRequest(`/api/videos/${collection}/${_id}/comment`, {
    method: 'POST',
    data: { message, parentId, user: { username: user.username } }
  })
}

export function updateComment({ collection, _id, message, user, commentId }) {
  if (isEmpty(user)) return
  return makeRequest(`/api/videos/${collection}/${_id}/comment/${commentId}`, {
    method: 'PUT',
    data: { message, user: { username: user.username } }
  })
}

export function deleteComment({ collection, _id, user, commentId }) {
  if (isEmpty(user)) return
  return makeRequest(`/api/videos/${collection}/${_id}/comment/${commentId}`, {
    method: 'DELETE',
    data: { user: { username: user.username } }
  })
}

export function updateCommentLike({ collection, _id, user, commentId }) {
  if (isEmpty(user)) return
  return makeRequest(
    `/api/videos/${collection}/${_id}/comment/likes/${commentId}`,
    {
      method: 'PUT',
      data: { user: { username: user.username } }
    }
  )
}
