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
  it('types and clears', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })
    cy.dataCy('search-bar').type('Fari')
    cy.dataCy('category').should('have.class', 'Mui-checked')
    cy.dataCy('search-bar').within(() => {
      cy.get('input').should('have.value', 'Fari')
      cy.get('input').type('{selectall}{backspace}{selectall}{backspace}')
      cy.get('input').should('have.value', '')
    })

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/mainstreambb')
    })
  })
  it('types and clears on page change', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })
    cy.dataCy('search-bar').type('Fari')
    cy.dataCy('category').should('have.class', 'Mui-checked')
    cy.dataCy('search-bar').within(() => {
      cy.get('input').should('have.value', 'Fari')
    })
    cy.dataCy('header-home-link').click()
    cy.dataCy('search-bar').within(() => {
      cy.get('input').should('have.value', '')
    })
  })
  it('Show no results page', () => {
    cy.intercept('GET', '/api/search?searchTerm=Will*', [])
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })
    cy.dataCy('search-bar').type('Will')
    cy.dataCy('no-results-found').should('exist')
    cy.dataCy('search-bar').within(() => {
      cy.get('input').should('have.value', 'Will')
      cy.get('input').type('{selectall}{backspace}{selectall}{backspace}')
      cy.get('input').should('have.value', '')
    })

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/mainstreambb')
    })
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
