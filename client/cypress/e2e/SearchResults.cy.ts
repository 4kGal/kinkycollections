import getMainstreambb from '../fixtures/getMainstreambb.json'
import initialMainstreamBBSettings from '../fixtures/initialMainstreamBBSettings.json'

describe('Search Results', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/videos/mainstreambb/settings',
      initialMainstreamBBSettings
    )
    cy.intercept('GET', '/api/search/filter/mainstreambb?*', getMainstreambb)
    cy.intercept('GET', '/api/search?searchTerm=Fari&collection=mainstreambb', [
      getMainstreambb.gallery.filter(
        (movie) =>
          movie.actresses.length === 1 && movie.actresses[0] === 'Anna Faris'
      )[0]
    ])
    cy.intercept('GET', '/api/search?searchTerm=Fari', [])
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&underage=false&eitherOr=or&sort=recent',
      getMainstreambb
    )
  })
  it.skip('Navigates between pages and displays correctly', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })
    cy.dataCy('search-bar').type('Fari')
    cy.dataCy('category').should('have.class', 'Mui-checked')
    cy.contains(getMainstreambb.gallery[0].name)
    cy.dataCy(`card-${getMainstreambb.gallery[0]._id}`)
    cy.dataCy(`card-${getMainstreambb.gallery[1]._id}`).should('not.exist')
    cy.dataCy('search-bar').within(() => {
      cy.get('input').type('{selectall}{backspace}{selectall}{backspace}')
    })
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/mainstreambb')
    })
  })
})
