import getMainstreambb from '../fixtures/getMainstreambb.json'

export const ADMIN_USER = {
  username: '4kgal',
  token: Cypress.env('ADMIN_TOKEN'),
  hideUnderage: false,
  lastLoggedIn: new Date(),
  userRoles: Cypress.env('ADMIN_TOKEN'),
  favorites: [getMainstreambb.gallery[0]._id, getMainstreambb.gallery[1]._id]
}

export const NON_ADMIN_USER = {
  username: 'nonAdminUser',
  favorites: [],
  hideUnderage: true,
  lastLoggedIn: new Date(),
  token:
    'eyJhbGciOiJIUzI1NiJ9.eyJVc2VybmFtZSI6Im5vbkFkbWluIn0.3mjMYvDXuly7Wq_gUCdBFm6rrjlBGPjyraVnLDAOjbM',
  userRoles:
    'eyJhbGciOiJIUzI1NiJ9.eyJVc2VybmFtZSI6Im5vbkFkbWluIn0.3mjMYvDXuly7Wq_gUCdBFm6rrjlBGPjyraVnLDAOjbM'
}

const adminUser = {
  username: '4kgal',
  email: '4kgal98@gmail.com',
  token: Cypress.env('ADMIN_TOKEN'),
  lastLoggedIn: new Date(),
  userRoles: Cypress.env('ADMIN_TOKEN'),
  favorites: [getMainstreambb.gallery[0]._id, getMainstreambb.gallery[1]._id]
}
export const getUser = (props) => {
  return JSON.stringify({ ...adminUser, ...props })
}
