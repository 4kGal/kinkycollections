import { MAINSTREAM_BB_COLLECTION } from '../utils/constants'
import { makeRequest } from './makeRequest'

export function getVideo(collection, _id) {
  return makeRequest(`/api/videos/${collection}/${_id}/data`)
}

export const getGalleryInitialSettings = (collection) => {
  if (collection !== MAINSTREAM_BB_COLLECTION) return Promise.resolve({})
  return makeRequest(`/api/videos/${collection}/settings`)
}

export const getGallery = (collection, queryStr) => {
  if (collection !== MAINSTREAM_BB_COLLECTION) return Promise.resolve({})
  console.log('getting')
  return makeRequest(`/api/search/filter/${collection}?${queryStr}`)
}
