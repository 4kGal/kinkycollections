import getMainstreambb from '../fixtures/getMainstreambb.json'
import initialMainstreamBBSettings from '../fixtures/initialMainstreamBBSettings.json'

describe('Search Results', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/videos/mainstreambb/settings',
      initialMainstreamBBSettings
    )
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&eitherOr=or&sort=recent',
      getMainstreambb
    )
    cy.intercept('GET', '/api/search?text=Fari&collection=*', [
      getMainstreambb.gallery.filter(
        (movie) =>
          movie.actresses.length === 1 && movie.actresses[0] === 'Anna Faris'
      )[0]
    ])
    cy.intercept('GET', '/api/search?text=Far&collection=*', [])
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&underage=false&eitherOr=or&sort=recent',
      getMainstreambb
    )
    cy.visit('/mainstreambb')
  })
  it('Navigates between pages and displays correctly', () => {
    cy.dataCy('search-bar').type('Fari')
    cy.dataCy('category').should('have.class', 'Mui-checked')
    cy.contains(getMainstreambb.gallery[0].name)
    cy.dataCy(`movie-${getMainstreambb.gallery[0]._id}`)
    cy.dataCy(`movie-${getMainstreambb.gallery[1]._id}`).should('not.exist')
    cy.dataCy('search-bar').type('{backspace}')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/mainstreambb')
    })
  })
})
