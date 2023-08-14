import getMainstreambb from '../fixtures/getMainstreambb.json'
import initialMainstreamBBSettings from '../fixtures/initialMainstreamBBSettings.json'
import getMainstreambbSqueeze from '../fixtures/filter/squeeze-filter.json'
import getMainstreambbSqueezeAnd from '../fixtures/filter/squeeze-and-filter.json'
import getMainstreambbVerbalSqueeze from '../fixtures/filter/squeeze-verbal-filter.json'
import getMainstreambbVerbalAndSqueeze from '../fixtures/filter/squeeze-and-verbal-filter.json'

describe('Filter Buttons', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/videos/mainstreambb/settings',
      initialMainstreamBBSettings
    )
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&eitherOr=*',
      getMainstreambb
    )
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&tags=squeeze&eitherOr=or&sort=recent',
      getMainstreambbSqueeze
    )
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&tags=squeeze&eitherOr=and&sort=recent',
      getMainstreambbSqueezeAnd
    )
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&tags=squeeze,verbal&eitherOr=or&sort=recent',
      getMainstreambbVerbalSqueeze
    )
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&tags=squeeze,verbal&eitherOr=and&sort=recent',
      getMainstreambbVerbalAndSqueeze
    )
    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&actresses=Anna%20Faris&eitherOr=*',
      {
        movies: getMainstreambb.movies.filter((movie) =>
          movie.actresses.includes('Anna Faris')
        )
      }
    )
    cy.visit('/mainstreamBB')
  })
  it('displays the correct filters', () => {
    cy.contains('squeeze (10)')
    cy.contains('nsfw (3)')
    cy.contains('verbal (10)')
    cy.contains('knee (17)')
    cy.contains('kick (20)')
    cy.contains('object (11)')
    cy.contains('taser (1)')
    cy.contains('castration (2)')
    cy.contains('stomp (1)')
    cy.contains('gunshot (1)')
    cy.contains('relative (1)')
    cy.contains('hit (9)')
    // cy.contains('multiple')
    // cy.contains('all').parent().should('have.class', 'Mui-disabled')

    cy.dataCy('switch').get('input').should('not.be.checked')
  })
  it.only('filter filters correctly', () => {
    cy.contains('squeeze').click()
    cy.contains('all').parent().should('not.have.class', 'Mui-disabled')
    cy.get('[data-cy^="movie-"]').should('have.length', 6)

    cy.get('[data-cy^="movie-"]').each(($button, i) => {
      expect($button.attr('data-cy')).to.eq(
        `movie-${getMainstreambbSqueeze.movies[i]._id}`
      )
    })

    cy.contains('squeeze (6)')
    cy.contains('verbal (1)')
    cy.contains('nsfw (1)')

    cy.contains('verbal').click()
    cy.get('[data-cy^="movie-"]').should('have.length', 8)
    cy.get('[data-cy^="movie-"]').each(($button, i) => {
      expect($button.attr('data-cy')).to.eq(
        `movie-${getMainstreambbVerbalSqueeze.movies[i]._id}`
      )
    })
    cy.contains('squeeze (6)')
    cy.contains('verbal (3)')
    cy.contains('nsfw (1)')

    cy.get('.MuiSwitch-input').click()
    cy.get('[data-cy^="movie-"]').should('have.length', 1)

    cy.contains('verbal (1)').click()
    cy.contains('squeeze (2)').click()

    cy.get('.MuiSwitch-input').click()
    cy.dataCy('switch').get('input').should('not.be.checked')

    cy.get('button').contains('#Anna Faris').click()

    // cy.contains('nsfw').click()
    // cy.dataCy(`movie-${getMainstreambb.movies[1]._id}`).should('exist')
    // cy.dataCy(`movie-${getMainstreambb.movies[0]._id}`).should('not.exist')
    // cy.get('[data-cy^="movie-"]').should('have.length', 1)

    // cy.contains('all').parent().click()
    // cy.dataCy('switch').get('input').should('not.be.checked')
    // cy.contains('all').parent().should('have.class', 'Mui-disabled')

    // cy.get('button').contains('#Gina Gershon').click()
    // cy.get('.MuiChip-label').contains('Gina Gershon').click()

    // cy.get('.MuiChip-label').contains('Gina Gershon').should('not.exist')

    // cy.get('button').contains('#Gina Gershon').click()
    // cy.get('.MuiChip-label').contains('Gina Gershon')
    // cy.contains('all').parent().click()
    // cy.get('[data-cy^="movie-"]').should('have.length', 10)

    // cy.get('.MuiChip-label').contains('Gina Gershon').should('not.exist')
  })
})
