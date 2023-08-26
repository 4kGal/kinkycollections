import getMainstreambb from '../fixtures/getMainstreambb.json'
import initialMainstreamBBSettings from '../fixtures/initialMainstreamBBSettings.json'
import { getUser, NON_ADMIN_USER } from '../support/constants'

describe('Gallery', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/videos/mainstreambb/settings',
      initialMainstreamBBSettings
    )
    cy.intercept('GET', '/api/user/favorites/4kgal', [])
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&hideUnderage=true&eitherOr=and&sort=recent',
      getMainstreambb
    ).as('getGallery')
  })
  it('displays loading message on loading', () => {
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
  it('displays error message on error response', () => {
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
})
