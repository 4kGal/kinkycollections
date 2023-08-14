import getMainstreambb from '../fixtures/getMainstreambb.json'
import initialMainstreamBBSettings from '../fixtures/initialMainstreamBBSettings.json'
describe('Nav Bar', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/videos/mainstreambb/settings',
      initialMainstreamBBSettings
    )
    cy.intercept('GET', '/api/user/favorites/4kgal', [
      getMainstreambb[0],
      getMainstreambb[1]
    ])
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&eitherOr=or&sort=recent',
      getMainstreambb
    )
  })
  it('update email if no email present', () => {
    cy.visit('/mainstreamBB', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'user',
          JSON.stringify({
            username: '4kgal',
            token: 'test',
            favorites: [getMainstreambb[0]._id, getMainstreambb[1]._id]
          })
        )
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
    cy.visit('/mainstreamBB', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'user',
          JSON.stringify({
            username: '4kgal',
            token: 'test',
            favorites: [getMainstreambb[0]._id, getMainstreambb[1]._id]
          })
        )
      }
    })
    cy.dataCy('open-nav-drawer').click()
    cy.dataCy('favorites-menu-item').click()

    cy.contains(getMainstreambb[0].name)
    cy.contains(getMainstreambb[1].name)

    cy.get('[data-testid="FavoriteIcon"]').should('have.length', 2)
    cy.get('[data-testid="FavoriteBorderIcon"]').should('not.exist')
  })
  //   it('sign out logs user out', () => {
  //     cy.dataCy('signout-menu-item').click({ force: true })

  //     expect(window.localStorage.getItem('user')).to.equal({ user: null })
  //   })
  it('does not show add email address if user already has email', () => {
    cy.visit('/mainstreamBB', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'user',
          JSON.stringify({
            username: '4kgal',
            token: 'test',
            email: '4kgal@gmail.com',

            favorites: [getMainstreambb[0]._id, getMainstreambb[1]._id]
          })
        )
      }
    })
    cy.dataCy('open-nav-drawer').click()
    cy.dataCy('add-email-menu-item').should('not.exist')
  })
  it.only('shows login if user is not logged in', () => {
    cy.visit('/mainstreamBB', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', 'null')
      }
    })
    cy.dataCy('open-nav-drawer').click()

    cy.dataCy('login-signup-menu-item')
    cy.dataCy('favorites-menu-item').should('not.exist')
    cy.dataCy('signout-menu-item').should('not.exist')
    cy.dataCy('add-email-menu-item').should('not.exist')
  })
})
