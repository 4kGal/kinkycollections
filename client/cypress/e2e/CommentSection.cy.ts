import { getUser, ADMIN_USER } from '../support/constants'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short'
})

const comments = [
  {
    id: 'commentId_1',
    message: 'OMG I love this so much!!',
    parentId: null,
    createdAt: '2023-07-15T22:20:17.336',
    likes: [
      'user1',
      'user2',
      'user3',
      'user4',
      'user5',
      'user5',
      'loggedInUser'
    ],
    user: {
      id: 'userId_1',
      username: 'JimBobUser'
    }
  },
  {
    id: 'commentId_2',
    message: 'Wish she did this to me!',
    parentId: 'commentId_1',
    createdAt: '2023-08-17T12:10:17.336',
    likes: ['user3', 'user4', 'user5'],
    user: {
      id: 'userId_2',
      username: 'CorkyRomanoUser'
    }
  },
  {
    id: 'commentId_3',
    message: 'Same! Cheers from Iraq',
    parentId: 'commentId_2',
    createdAt: '2023-08-18T11:10:17.336',
    likes: ['user1', 'user3', 'user5', 'loggedInUser'],
    user: {
      id: 'userId_3',
      username: 'SlappHappyUser'
    }
  },
  {
    id: 'commentId_4',
    message: 'Frick yeah!',
    parentId: 'commentId_2',
    createdAt: '2023-08-19T11:10:17.336',
    likes: [],
    user: {
      id: 'userId_1',
      username: 'JimBobUser'
    }
  },
  {
    id: 'commentId_5',
    message: 'Good googily moogily',
    parentId: null,
    createdAt: '2023-08-12T11:10:17.336',
    likes: ['user5'],
    user: {
      id: 'loggedInUser',
      username: 'loggedInUser'
    }
  }
]
describe('Comments', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/videos/mainstreambb/64e114c534a31da16451d59d/data',
      {
        name: "Zoe Saldana Stomps on a Man's Balls Numerous Times in Special Ops Lioness 1x4",
        videoId: 'this-is-the-video-id',
        comments
      }
    )
    cy.intercept(
      'POST',
      '/api/videos/mainstreambb/64e114c534a31da16451d59d/comment',
      [
        ...comments,
        {
          id: '64fdfb6b23af9b7bc401ceec',
          parentId: null,
          message: 'here is a new comment',
          createdAt: new Date().toISOString(),
          likes: [],
          user: {
            id: 'loggedInUser',
            username: 'loggedInUser'
          }
        }
      ]
    )
    cy.intercept(
      'DELETE',
      '/api/videos/mainstreambb/64e114c534a31da16451d59d/comment/commentId_5',
      comments.filter((comment, i) => {
        if (comment.id !== 'commentId_5') return comment
      })
    )
  })
  it('comments displayed when a user is logged in and has comments', () => {
    cy.visit('/player/mainstreambb/64e114c534a31da16451d59d', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser({ username: 'loggedInUser' }))
      }
    })
    const rootCmnt0 = 'root-comment-0'
    const rootCmnt1 = 'root-comment-1'
    cy.dataCy(rootCmnt0)
    cy.dataCy(rootCmnt1)
    cy.dataCy('root-comment-2').should('not.exist')

    cy.dataCy(rootCmnt0).within(() => {
      cy.contains('loggedInUser')
      cy.contains('Aug 12, 2023, 11:10 AM')
      cy.contains('Good googily moogily')

      // logged in user so favorite should only be filled in if likes > 0

      cy.dataCy('favorite-icon-0').should('have.text', 1)
      cy.dataCy('edit-icon-0')
      cy.dataCy('reply-icon-0')
      cy.dataCy('delete-icon-0')
    })

    cy.dataCy(rootCmnt1).within(() => {
      cy.contains('JimBobUser')
      cy.contains('Jul 15, 2023, 10:20 PM')
      cy.contains('OMG I love this so much!!')
      cy.dataCy('favorite-icon-1-isActive').should('have.text', 7)
      cy.dataCy('edit-icon-1').should('not.exist')
      cy.dataCy('reply-icon-1')
      cy.dataCy('delete-icon-1').should('not.exist')
    })

    // Changes sort
    cy.get('.MuiSwitch-root').within(() => {
      cy.get('input').click({ force: true })
    })
    cy.dataCy(rootCmnt0).contains('JimBobUser')
    cy.dataCy(rootCmnt1).contains('loggedInUser')

    // Replying is not disabled
    cy.dataCy('reply-icon-0').should('not.be.disabled')

    // New comment is not disabled
    cy.dataCy('new-comment-text-area').should('not.have.class', 'Mui-disabled')
    cy.dataCy('new-comment-submit-btn').should('have.class', 'Mui-disabled')
    cy.dataCy('new-comment-text-area').type('New comment')
    cy.dataCy('new-comment-submit-btn').should('not.have.class', 'Mui-disabled')
  })

  it('user is not logged in and cannot add new comment', () => {
    cy.visit('/player/mainstreambb/64e114c534a31da16451d59d', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', null)
      }
    })

    // Replying is not disabled
    cy.dataCy('reply-icon-0').should('be.disabled')

    // New comment is disabled
    cy.dataCy('new-comment-text-area').should('have.class', 'Mui-disabled')
    cy.dataCy('new-comment-submit-btn').should('have.class', 'Mui-disabled')
  })
  it('user can add comments', () => {
    cy.visit('/player/mainstreambb/64e114c534a31da16451d59d', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser({ username: 'loggedInUser' }))
      }
    })
    cy.dataCy('new-comment-submit-btn').should('be.disabled')
    cy.dataCy('new-comment-text-area').type('here is a new comment')
    cy.dataCy('new-comment-submit-btn').should('not.be.disabled')

    cy.dataCy('new-comment-submit-btn').click()
    cy.dataCy('root-comment-0').within(() => {
      cy.contains('loggedInUser')
      cy.contains(dateFormatter.format(new Date()))
      cy.contains('here is a new comment')
    })

    cy.get('.MuiSwitch-root').within(() => {
      cy.get('input').click({ force: true })
    })

    // There was a bug that sorting was hidding newly added comment
    cy.contains('here is a new comment')
  })
  it('user can add first comment', () => {
    cy.intercept(
      'GET',
      '/api/videos/mainstreambb/64e114c534a31da16451d59d/data',
      {
        name: "Zoe Saldana Stomps on a Man's Balls Numerous Times in Special Ops Lioness 1x4",
        videoId: 'this-is-the-video-id'
      }
    )

    cy.intercept(
      'POST',
      '/api/videos/mainstreambb/64e114c534a31da16451d59d/comment',
      [
        {
          id: '64fdfb6b23af9b7bc401ceec',
          parentId: null,
          message: 'here is a new comment',
          createdAt: new Date().toISOString(),
          likes: [],
          user: {
            id: 'loggedInUser',
            username: 'loggedInUser'
          }
        }
      ]
    )

    cy.visit('/player/mainstreambb/64e114c534a31da16451d59d', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser({ username: 'loggedInUser' }))
      }
    })
    cy.dataCy('root-comment-0').should('not.exist')
    cy.dataCy('new-comment-submit-btn').should('be.disabled')
    cy.dataCy('new-comment-text-area').type('here is a new comment')
    cy.dataCy('new-comment-submit-btn').should('not.be.disabled')
    cy.dataCy('new-comment-submit-btn').click()
    cy.dataCy('root-comment-0').should('exist')
  })
  it('can reply', () => {
    cy.intercept(
      'POST',
      '/api/videos/mainstreambb/64e114c534a31da16451d59d/comment',
      [
        {
          id: '64fdfb6b23af9b7bc401ceec',
          parentId: null,
          message: 'here is a new comment',
          createdAt: new Date().toISOString(),
          likes: [],
          user: {
            id: 'loggedInUser',
            username: 'loggedInUser'
          }
        }
      ]
    )

    cy.intercept(
      'POST',
      '/api/videos/mainstreambb/64e114c534a31da16451d59d/comment',
      [
        ...comments,
        {
          id: '64fdfb6b23af9b7bc401ceec',
          parentId: 'commentId_4',
          message: 'here is a reply',
          createdAt: new Date().toISOString(),
          likes: [],
          user: {
            id: 'loggedInUser',
            username: 'loggedInUser'
          }
        }
      ]
    )

    cy.visit('/player/mainstreambb/64e114c534a31da16451d59d', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser({ username: 'loggedInUser' }))
      }
    })
    cy.dataCy('comment-header-0')
      .eq(2)
      .parent()
      .within(() => {
        cy.dataCy('reply-icon-0').eq(0).click()
      })
    cy.dataCy('new-comment-submit-btn').eq(1).should('not.be.enabled')
    cy.dataCy('comment-header-0').eq(2).parent().next().type('here is a reply')
    cy.dataCy('new-comment-submit-btn').eq(1).click()

    cy.dataCy('child-comment-0').eq(1).contains('Frick yeah!')
    cy.dataCy('child-comment-0')
      .eq(1)
      .parent()
      .within(() => {
        cy.contains('here is a reply')
      })

    cy.get('.MuiSwitch-root').within(() => {
      cy.get('input').click({ force: true })
    })
    cy.contains('here is a reply')
  })
  it('can delete', () => {
    cy.intercept(
      'POST',
      '/api/videos/mainstreambb/64e114c534a31da16451d59d/comment',
      [
        {
          id: '64fdfb6b23af9b7bc401ceec',
          parentId: null,
          message: 'here is a new comment',
          createdAt: new Date().toISOString(),
          likes: [],
          user: {
            id: 'loggedInUser',
            username: 'loggedInUser'
          }
        }
      ]
    )

    cy.visit('/player/mainstreambb/64e114c534a31da16451d59d', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser({ username: 'loggedInUser' }))
      }
    })

    cy.dataCy('root-comment-1').within(() => {
      cy.dataCy('delete-icon-0').should('not.exist')
    })

    cy.contains(comments[comments.length - 1].message).should('exist')

    cy.dataCy('root-comment-0').within(() => {
      cy.dataCy('delete-icon-0').click()
    })
    cy.contains(comments[comments.length - 1].message).should('not.exist')

    cy.get('.MuiSwitch-root').within(() => {
      cy.get('input').click({ force: true })
    })
    cy.contains(comments[comments.length - 1].message).should('not.exist')
  })
  it('can favorite', () => {
    cy.visit('/player/mainstreambb/64e114c534a31da16451d59d', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', getUser({ username: 'loggedInUser' }))
      }
    })

    cy.intercept(
      'PUT',
      '/api/videos/mainstreambb/64e114c534a31da16451d59d/comment/likes/commentId_4',
      comments.map((comment) => {
        if (comment.id === 'commentId_4') {
          comment.likes = ['loggedInUser']
        }
        return comment
      })
    )
    cy.contains('Frick yeah!')
      .parent()
      .parent()
      .within(() => {
        cy.dataCy('favorite-icon-0').click()
        cy.dataCy('favorite-icon-0-isActive').should('exist')
      })

    cy.dataCy('child-comment-1').within(() => {
      cy.contains('Same! Cheers from Iraq')
    })
    cy.get('.MuiSwitch-root').within(() => {
      cy.get('input').click({ force: true })
    })
    cy.dataCy('child-comment-1').within(() => {
      cy.contains('Same! Cheers from Iraq').should('not.exist')
      cy.contains('Frick yeah!')
    })
  })
  describe('error handling', () => {
    it('adding a comment', () => {
      cy.intercept(
        'GET',
        '/api/videos/mainstreambb/64e114c534a31da16451d59d/data',
        { statusCode: 500 }
      )
      cy.visit('/player/mainstreambb/64e114c534a31da16451d59d', {
        onBeforeLoad(win) {
          win.localStorage.setItem(
            'user',
            getUser({ username: 'loggedInUser' })
          )
        }
      })
      cy.dataCy('error-message').should('not.exist')

      cy.dataCy('new-comment-text-area').type('here is a new comment')
      cy.dataCy('new-comment-submit-btn').click()
      cy.dataCy('error-message').should('exist')
    })
    it.skip('delete', () => {
      cy.intercept(
        'DELETE',
        '/api/videos/mainstreambb/64e114c534a31da16451d59d/comment/commentId_5',
        { statusCode: 500 }
      )

      cy.visit('/player/mainstreambb/64e114c534a31da16451d59d', {
        onBeforeLoad(win) {
          win.localStorage.setItem(
            'user',
            getUser({ username: 'loggedInUser' })
          )
        }
      })
      cy.dataCy('root-comment-0').within(() => {
        cy.dataCy('delete-icon-0').click()
      })
    })
  })
})
