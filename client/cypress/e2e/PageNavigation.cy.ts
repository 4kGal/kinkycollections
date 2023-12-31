import getMainstreambb from '../fixtures/getMainstreambb.json'
import initialMainstreamBBSettings from '../fixtures/initialMainstreamBBSettings.json'

describe('Page Navigation', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/videos/mainstreambb/settings*',
      initialMainstreamBBSettings
    )
    cy.intercept('GET', '/api/search/filter/mainstreambb*', getMainstreambb)
    cy.visit('/mainstreambb')
  })
  it('navigates forward and back correctly', () => {
    cy.contains('1 of 27')
    cy.dataCy('first-page-button').should('be.disabled')
    cy.dataCy('previous-page-button').should('be.disabled')
    cy.dataCy('next-page-button').should('not.be.disabled')
    cy.dataCy('last-page-button').should('not.be.disabled')

    cy.dataCy('next-page-button').click()
    cy.contains('2 of 27')
    cy.dataCy('first-page-button').should('not.be.disabled')
    cy.dataCy('previous-page-button').should('not.be.disabled')
    cy.dataCy('next-page-button').should('not.be.disabled')
    cy.dataCy('last-page-button').should('not.be.disabled')

    cy.dataCy('next-page-button').click()
    cy.contains('3 of 27')
    cy.dataCy('first-page-button').should('not.be.disabled')
    cy.dataCy('previous-page-button').should('not.be.disabled')

    cy.dataCy('previous-page-button').click()
    cy.contains('2 of 27')
    cy.dataCy('first-page-button').should('not.be.disabled')
    cy.dataCy('previous-page-button').should('not.be.disabled')
    cy.dataCy('next-page-button').should('not.be.disabled')
    cy.dataCy('last-page-button').should('not.be.disabled')

    cy.dataCy('previous-page-button').click()
    cy.contains('1 of 27')
    cy.dataCy('first-page-button').should('be.disabled')
    cy.dataCy('previous-page-button').should('be.disabled')
    cy.dataCy('next-page-button').should('not.be.disabled')
    cy.dataCy('last-page-button').should('not.be.disabled')

    cy.dataCy('last-page-button').click()
    cy.contains('27 of 27')
    cy.dataCy('first-page-button').should('not.be.disabled')
    cy.dataCy('previous-page-button').should('not.be.disabled')
    cy.dataCy('next-page-button').should('be.disabled')
    cy.dataCy('last-page-button').should('be.disabled')

    cy.dataCy('first-page-button').click()
    cy.contains('1 of 27')
    cy.dataCy('first-page-button').should('be.disabled')
    cy.dataCy('previous-page-button').should('be.disabled')
    cy.dataCy('next-page-button').should('not.be.disabled')
    cy.dataCy('last-page-button').should('not.be.disabled')
  })
})
