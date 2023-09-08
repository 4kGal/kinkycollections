import getMainstreambb from '../fixtures/getMainstreambb.json'
import getMainstreampe from '../fixtures/getMainstreampe.json'

import initialMainstreamBBSettings from '../fixtures/initialMainstreamBBSettings.json'
import initialMainstreamPESettings from '../fixtures/initialMainstreamPESettings.json'
import { getUser, ADMIN_USER, NON_ADMIN_USER } from '../support/constants'

describe('Gallery', () => {
  const gallery = getMainstreambb.gallery

  const userWithNewFavorites = ADMIN_USER.favorites.push(gallery[3]._id)
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/videos/mainstreambb/settings',
      initialMainstreamBBSettings
    )
    cy.intercept('GET', '/api/user/favorites/4kgal', [])
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?*',
      getMainstreambb
    ).as('getGallery')
    cy.intercept(
      'PUT',
      '/api/user/favorites/',
      getUser({ favorites: userWithNewFavorites.favorites })
    )
    cy.intercept(
      'GET',
      '/api/videos/mainstreampe/settings',
      initialMainstreamPESettings
    )
    cy.intercept('GET', '/api/search/filter/mainstreampe?*', getMainstreampe)
  })
  it('displays loading on loading', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })
    cy.dataCy('gallery-loading').should('exist')
    cy.wait('@getGallery')
    cy.dataCy('gallery-loading').should('not.exist')

    cy.dataCy('error-message').should('not.exist')
    cy.dataCy('error-contact-me-message').should('not.exist')
  })
  it.skip('displays error message on error response', () => {
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&hideUnderage=true&eitherOr=and&sort=recent',
      { statusCode: 500 }
    ).as('getServerFailure')

    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })
    cy.wait('@getServerFailure')

    cy.dataCy('error-message').should('exist')
    cy.dataCy('error-contact-me-message').should('exist')
  })
  it('favorites', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser())
      }
    })

    for (let i = 0; i < 9; i++) {
      if (i < 2) {
        cy.dataCy(`${gallery[i]._id}-favorited`)
      } else {
        cy.dataCy(`${gallery[i]._id}-not-favorited`)
      }
    }
    cy.dataCy(`${gallery[3]._id}-not-favorited`).click()
  })
  it('displays favorite error', () => {
    cy.intercept('PUT', '/api/user/favorites/', { statusCode: 500 }).as(
      'getServerFailure'
    )

    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser())
      }
    })
    cy.dataCy(`${gallery[3]._id}-not-favorited`).click()

    cy.wait('@getServerFailure')
    cy.dataCy(`${gallery[3]._id}-error-message`)
  })
  it('does not display admin controls if user is not an admin', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser(NON_ADMIN_USER))
      }
    })
    cy.dataCy('admin-card-controls').should('not.exist')
  })
  it('displays admin controls if user is an admin', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser())
      }
    })
    cy.dataCy('open-nav-drawer').click()
    cy.dataCy('display-admin-control-menu-item').within(() => {
      cy.get('input').click()
    })
    cy.dataCy('close-side-nav-btn').click()
    cy.dataCy('admin-card-controls-btn').should('exist')
  })
  it.only('switches context', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })
    cy.dataCy(`card-${getMainstreambb.gallery[0]._id}`)

    cy.dataCy('header-home-link').click()

    cy.dataCy(`folder-link-mainstreampe`).click()
    cy.dataCy(`card-${getMainstreambb.gallery[0]._id}`).should('not.exist')
    cy.dataCy(`card-${getMainstreampe.gallery[0]._id}`)
  })
})
