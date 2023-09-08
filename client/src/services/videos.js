import { GALLERY_PAGES } from '../utils/constants'
import { makeRequest } from './makeRequest'

export function getVideo(collection, _id) {
  return makeRequest(`/api/videos/${collection}/${_id}/data`)
}

export const getGalleryInitialSettings = (collection) => {
  if (!GALLERY_PAGES.includes(collection)) return Promise.resolve({})
  return makeRequest(`/api/videos/${collection}/settings`)
}

export const getGallery = (collection, queryStr) => {
  if (!GALLERY_PAGES.includes(collection)) return Promise.resolve({})
  return makeRequest(`/api/search/filter/${collection}?${queryStr}`)
}

export const getSearchResults = ({ collection, searchTerm }) => {
  let queryString = `?searchTerm=${searchTerm}`
  if (collection.length > 1) {
    queryString += `&collection=${collection}`
  }

  return makeRequest(`/api/search${queryString}`)
}
