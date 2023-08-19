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
      getMainstreambb.movies.filter(
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
    cy.visit('/mainstreamBB')
  })
  it('Navigates between pages and displays correctly', () => {
    cy.dataCy('search-bar').type('Fari')
    cy.dataCy('category').should('have.class', 'Mui-checked')
    cy.contains(getMainstreambb.movies[0].name)
    cy.dataCy(`movie-${getMainstreambb.movies[0]._id}`)
    cy.dataCy(`movie-${getMainstreambb.movies[1]._id}`).should('not.exist')
    cy.dataCy('search-bar').type('{backspace}')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/mainstreamBB')
    })
  })
})
