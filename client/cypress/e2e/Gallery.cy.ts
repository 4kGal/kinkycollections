import getMainstreambb from '../fixtures/getMainstreambb.json'
import initialMainstreamBBSettings from '../fixtures/initialMainstreamBBSettings.json'
import { getUser, ADMIN_USER } from '../support/constants'

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
  })
  it.skip('displays loading message on loading', () => {
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
})
