import { makeRequest } from './makeRequest'

export function getVideo(collection, _id) {
  return makeRequest(`/api/videos/${collection}/${_id}/data`)
}

export const getGalleryInitialSettings = (collection) => {
  return makeRequest(`/api/videos/${collection}/settings`)
}

export const getGallery = (collection, queryStr) => {
  console.log('in getgallery')
  return makeRequest(`/api/search/filter/${collection}?${queryStr}`)
}
