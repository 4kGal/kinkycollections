import getMainstreambb from '../fixtures/getMainstreambb.json'

export const ADMIN_USER = JSON.stringify({
  username: '4kgal',
  token: Cypress.env('ADMIN_TOKEN'),
  userRoles: Cypress.env('ADMIN_USER_ROLES'),
  favorites: [getMainstreambb.movies[0]._id, getMainstreambb.movies[1]._id]
})

const adminUser = {
  username: '4kgal',
  email: '4kgal98@gmail.com',
  token: Cypress.env('ADMIN_TOKEN'),
  userRoles: Cypress.env('ADMIN_USER_ROLES'),
  favorites: [getMainstreambb.movies[0]._id, getMainstreambb.movies[1]._id]
}
export const getUser = (props = adminUser) => {
  return JSON.stringify({ ...adminUser, ...props })
}
