import getMainstreambb from '../fixtures/getMainstreambb.json'

describe('Authentication Pages', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/mainstreambb', getMainstreambb)

    cy.visit('/login')
  })
  it('renders and logs in', () => {
    cy.contains('Sign in to save/view your favorite videos')
    cy.dataCy('email-field').should('not.exist')
    cy.dataCy('username-field').should('be.empty')
    cy.dataCy('password-field').should('be.empty')
    cy.dataCy('submit-button').should('be.disabled')
    cy.contains("Don't have an account? Click here")

    cy.dataCy('username-field').type('4kgal')
    cy.dataCy('submit-button').should('be.disabled')

    cy.dataCy('password-field').type('Tanner22!')
    cy.dataCy('submit-button').should('not.be.disabled')
    cy.get('button').contains('Login')
  })
  it('switches to sign up page and signs up user', () => {
    cy.get('u').click()
    cy.contains('Sign in to save/view your favorite videos').should('not.exist')
    cy.contains('Register to save/view your favorite videos').should('exist')
    cy.dataCy('email-field').should('be.empty')
    cy.dataCy('username-field').should('be.empty')
    cy.dataCy('password-field').should('be.empty')

    cy.dataCy('submit-button').should('be.disabled')
    cy.contains("Don't have an account? Click here").should('not.exist')
    cy.contains('Already have an account? Click here')

    cy.dataCy('email-field').type('test@gmail.com')
    cy.dataCy('submit-button').should('be.disabled')

    cy.dataCy('username-field').type('4kgal')
    cy.dataCy('submit-button').should('be.disabled')

    cy.dataCy('password-field').type('Tanner22!')
    cy.dataCy('submit-button').should('not.be.disabled')
    cy.get('button').contains('Signup')
  })
  it('switching to sign up page clears values', () => {
    cy.dataCy('username-field').type('4kgal')
    cy.dataCy('password-field').type('Tanner22!')

    cy.get('u').click()

    cy.dataCy('email-field').should('be.empty')

    cy.dataCy('username-field').should('be.empty')
    cy.dataCy('password-field').should('be.empty')
  })
  // it('skips')
  it('shows error message when there is a 400 response', () => {
    cy.intercept('POST', '/api/user/signup', { statusCode: 400 }).as(
      'fourhundredError'
    )
    cy.get('u').click()
    cy.dataCy('error-message').should('not.exist')
    cy.dataCy('username-field').type('4kgal')
    cy.dataCy('password-field').type('Tanner22!')

    cy.dataCy('submit-button').click()
    cy.wait('@fourhundredError')

    cy.dataCy('error-message')
  })
  it('shows error message when there is a 400 response', () => {
    cy.intercept('POST', '/api/user/signup', { statusCode: 500 }).as(
      'getServerFailure'
    )
    cy.get('u').click()
    cy.dataCy('error-message').should('not.exist')
    cy.dataCy('username-field').type('4kgal')
    cy.dataCy('password-field').type('Tanner22!')

    cy.dataCy('submit-button').click()
    cy.wait('@getServerFailure')

    cy.dataCy('error-message')
  })
})
