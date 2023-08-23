import { makeRequest } from './makeRequest'

export function getVideo(collection, _id) {
  return makeRequest(`/api/videos/${collection}/${_id}/data`)
}

export const getGalleryInitialSettings = (collection) => {
  console.log('getting initial settings', collection)
  return makeRequest(`/api/videos/${collection}/settings`)
}
