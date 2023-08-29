import getMainstreambb from '../fixtures/getMainstreambb.json'
import initialMainstreamBBSettings from '../fixtures/initialMainstreamBBSettings.json'
import { getUser, NON_ADMIN_USER } from '../support/constants'

describe('Nav Bar', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/videos/mainstreambb/settings',
      initialMainstreamBBSettings
    )
    cy.intercept('GET', '/api/user/favorites/4kgal', [
      getMainstreambb.gallery[0],
      getMainstreambb.gallery[1]
    ])
    cy.intercept('GET', '/api/search/filter/mainstreambb?&*', getMainstreambb)
  })
  it('shows admin control switch if admin is logged in', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser())
      }
    })
    cy.dataCy('open-nav-drawer').click()
    cy.contains('Display Admin Controls')
  })
  it('does not show admin control switch if user is not an admin', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser(NON_ADMIN_USER))
      }
    })
    cy.dataCy('open-nav-drawer').click()
    cy.contains('Display Admin Controls').should('not.exist')
  })
  it('update email if no email present', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser({ email: '' }))
      }
    })
    cy.dataCy('open-nav-drawer').click()
    cy.dataCy('login-signup-menu-item').should('not.exist')
    cy.dataCy('favorites-menu-item')
    cy.dataCy('signout-menu-item')
    cy.dataCy('add-email-menu-item').click()

    cy.contains('Add an email to save/view your favorite videos')
    cy.dataCy('email-field')
    cy.dataCy('password-field').should('not.exist')
    cy.dataCy('username-field').should('not.exist')
    cy.get('button').contains('Update').should('have.class', 'Mui-disabled')

    cy.dataCy('email-field').type('4kgal')
    cy.get('button').contains('Update').should('have.class', 'Mui-disabled')
    cy.dataCy('email-field').type('4kgal@gmail.com')
    cy.get('button').contains('Update').should('not.have.class', 'Mui-disabled')
  })
  it('navigates and loads favorites', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser())
      }
    })
    cy.dataCy('open-nav-drawer').click()
    cy.dataCy('favorites-menu-item').click()

    cy.contains(getMainstreambb.gallery[0].name)
    cy.contains(getMainstreambb.gallery[1].name)

    cy.get('[data-testid="FavoriteIcon"]').should('have.length', 2)
    cy.get('[data-testid="FavoriteBorderIcon"]').should('not.exist')
  })
  it('sign out logs user out', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser())
      }
    })
    cy.dataCy('open-nav-drawer').click()

    cy.dataCy('signout-menu-item').click({ force: true })

    expect(window.localStorage.getItem('user')).to.equal(null)
  })
  it('does not show add email address if user already has email', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser())
      }
    })
    cy.dataCy('open-nav-drawer').click()
    cy.dataCy('add-email-menu-item').should('not.exist')
  })
  it('shows login if user is not logged in', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.removeItem('user')
      }
    })
    cy.dataCy('open-nav-drawer').click()

    cy.dataCy('login-signup-menu-item')
    cy.dataCy('favorites-menu-item').should('not.exist')
    cy.dataCy('signout-menu-item').should('not.exist')
    cy.dataCy('add-email-menu-item').should('not.exist')
  })
  it('updates page on selection change', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })
    cy.contains('1 of 27')
    cy.dataCy('open-nav-drawer').click()

    cy.dataCy('videos-per-page-select').parent().click()
    cy.get("[data-value='27']").click()
    cy.contains('1 of 9')
  })
  it('updates page on actress selection change', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })
    cy.dataCy('open-nav-drawer').click()
    cy.dataCy('filter-by-actress-clear-btn').should('not.exist')

    cy.dataCy('filter-actress-menu-item').click()
    cy.dataCy('actress-name-0').click({ force: true })
    cy.dataCy('actress-name-0').should('have.class', 'Mui-selected')

    cy.dataCy('filter-by-actress-clear-btn').should('exist')
    cy.dataCy('actress-name-2').click({ force: true })
    cy.dataCy('actress-name-2').should('have.class', 'Mui-selected')

    cy.dataCy('actress-name-3').click({ force: true })
    cy.dataCy('actress-name-3').should('have.class', 'Mui-selected')

    cy.dataCy('actress-name-3').click({ force: true })
    cy.dataCy('actress-name-3').should('not.have.class', 'Mui-selected')

    cy.dataCy('filter-by-actress-clear-btn').click()

    cy.dataCy('actress-name-0').should('not.have.class', 'Mui-selected')
    cy.dataCy('actress-name-2').should('not.have.class', 'Mui-selected')
  })
  it('updates page on decade selection change', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })
    cy.dataCy('open-nav-drawer').click()
    cy.dataCy('filter-by-decade-clear-btn').should('not.exist')

    cy.dataCy('filter-decade-menu-item').click()
    cy.dataCy('decade-0').click({ force: true })
    cy.dataCy('decade-0').should('have.class', 'Mui-selected')

    cy.dataCy('filter-by-decade-clear-btn').should('exist')
    cy.dataCy('decade-2').click({ force: true })
    cy.dataCy('decade-2').should('have.class', 'Mui-selected')

    cy.dataCy('decade-3').click({ force: true })
    cy.dataCy('decade-3').should('have.class', 'Mui-selected')

    cy.dataCy('decade-3').click({ force: true })
    cy.dataCy('decade-3').should('not.have.class', 'Mui-selected')

    cy.dataCy('filter-by-decade-clear-btn').click()

    cy.dataCy('decade-0').should('not.have.class', 'Mui-selected')
    cy.dataCy('decade-2').should('not.have.class', 'Mui-selected')
  })
  it.skip('selectors', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser(NON_ADMIN_USER))
      }
    })
    cy.dataCy('open-nav-drawer').click()

    cy.dataCy('display-underage-option').within(() => {
      cy.get('input').should('be.checked')
    })

    cy.contains('Sort').click()
    cy.contains('Most Liked')
    cy.contains('Added').click()
    cy.dataCy('sort-button-recent').should('have.class', 'Mui-selected')
    cy.dataCy('sort-button-recent').within(() => {
      cy.get('input').should('be.checked')
      cy.get('input').click()
      cy.get('input').should('not.be.checked')
    })
    cy.contains('Year Released').click()
    cy.dataCy('sort-button-year').should('have.class', 'Mui-selected')
    cy.dataCy('sort-button-year').within(() => {
      cy.get('input').should('be.checked')
      cy.get('input').click()
      cy.get('input').should('not.be.checked')
    })
    cy.dataCy('sort-button-recent').should('not.have.class', 'Mui-selected')
    cy.dataCy('sort-button-recent').within(() => {
      cy.get('input').should('not.exist')
    })
    cy.contains('Randomize')
  })
  it('loads underage selector if user has it true', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser({ hideUnderage: true }))
      }
    })
    cy.dataCy('open-nav-drawer').click()

    cy.dataCy('display-underage-option').within(() => {
      cy.get('input').should('be.checked')
    })
  })
  it('loads underage selector if user has it false', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser({ hideUnderage: false }))
      }
    })
    cy.dataCy('open-nav-drawer').click()

    cy.dataCy('display-underage-option').within(() => {
      cy.get('input').should('not.be.checked')
    })
  })
  it('underage selector is true if user is not logged in', () => {
    cy.visit('/mainstreambb', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })
    cy.dataCy('open-nav-drawer').click()

    cy.dataCy('display-underage-option').within(() => {
      cy.get('input').should('be.checked')
    })
  })
})
