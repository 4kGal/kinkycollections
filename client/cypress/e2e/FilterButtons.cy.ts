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
    cy.intercept('GET', '/api/search/filter/mainstreambb?&eitherOr=*', [])

    cy.intercept(
      'GET',
      '/api/search/filter/mainstreambb?&hideUnderage=true*',
      getMainstreambb
    )

    cy.intercept('GET', '/api/search/filter/mainstreambb?&decades=1970*', {
      gallery: [
        {
          _id: '64e114c534a31da16451d593',
          year: 1976,
          title: 'The First Nudie Musical',
          tags: ['kick', 'nsfw'],
          actresses: [],
          videoId: 'de357dfc-81a1-4497-90f7-f5dc934c55af',
          dateUploaded: '2023-08-19T05:31:33.478',
          name: 'Unknown Actress Kicks a Man in the Balls in the First Nudie Musical',
          views: 0,
          underage: false,
          collection: 'mainstreambb',
          customName: '',
          originalFileName:
            'Unknown Actress Kicks a Man in the Balls in the First Nudie Musical (1976).mp4',
          addedDate: '2023-08-19T19:15:17.000Z',
          likes: 0
        },
        {
          _id: '64e114c534a31da16451d58b',
          year: 1974,
          title: 'Five Loose Women',
          tags: ['knee'],
          actresses: ['Tallie Cochrane', 'Donna Young'],
          videoId: '4ed4ca62-4bdd-4839-95c4-3903f07aac41',
          dateUploaded: '2023-08-19T05:51:41.016',
          name: 'Tallie Cochrane Knees a Man in the Balls, Then Later Donna Young Knees Another Man in the Balls in Five Loose Women',
          views: 0,
          underage: false,
          collection: 'mainstreambb',
          customName: '',
          originalFileName:
            'Tallie Cochrane Knees a Man in the Balls, Then Later Donna Young Knees Another Man in the Balls in Five Loose Women (1974).mp4',
          addedDate: '2023-08-19T19:15:17.000Z',
          likes: 0
        },
        {
          _id: '64e114c534a31da16451d576',
          year: 1974,
          title: 'Kuroi Mehyô M/Black Panther Bitch M',
          tags: ['squeeze'],
          actresses: ['Reiko Ike'],
          videoId: 'e9f4f780-f804-4064-9fae-815aac9799ce',
          dateUploaded: '2023-08-19T06:12:26.318',
          name: "Reiko Ike Squeezes a Man's Balls in Kuroi Mehyô M/Black Panther Bitch M",
          views: 0,
          underage: false,
          collection: 'mainstreambb',
          customName: '',
          originalFileName:
            "Reiko Ike Squeezes a Man's Balls in Kuroi Mehyô MBlack Panther Bitch M (1974).mp4",
          addedDate: '2023-08-19T19:15:17.000Z',
          likes: 0
        },
        {
          _id: '64e114c534a31da16451d556',
          year: 1978,
          title: "Avere Vent'anni/To Be Twenty",
          tags: ['stomp'],
          actresses: ['Lilli Carati', 'Gloria Guida'],
          videoId: 'bd5e42a8-98f8-4091-a3bc-c0689ad583e5',
          dateUploaded: '2023-08-19T06:32:41.041',
          name: "Lilli Carati Stomps on a Man's Balls, Then Backhands Another Man in the Balls in Front of Gloria Guida in Avere Vent'anni/To Be Twenty",
          views: 0,
          underage: false,
          collection: 'mainstreambb',
          customName: '',
          originalFileName:
            "Lilli Carati Stomps on a Man's Balls, Then Backhands Another Man in the Balls in Front of Gloria Guida in Avere Vent'anniTo Be Twenty (1978).mp4",
          addedDate: '2023-08-19T19:15:17.000Z',
          likes: 0
        },
        {
          _id: '64e114c534a31da16451d53e',
          year: 1973,
          title: 'The MacKintosh Man',
          tags: ['kick'],
          actresses: ['Jenny Runacre'],
          videoId: '4f600d6e-ae57-462d-9853-2f56969b1de1',
          dateUploaded: '2023-08-19T06:48:41.136',
          name: 'Jenny Runacre Kicks a Man in the Balls in the MacKintosh Man',
          views: 0,
          underage: false,
          collection: 'mainstreambb',
          customName: '',
          originalFileName:
            'Jenny Runacre Kicks a Man in the Balls in the MacKintosh Man (1973).mp4',
          addedDate: '2023-08-19T19:15:17.000Z',
          likes: 0
        },
        {
          _id: '64e114c534a31da16451d51c',
          year: 1973,
          title: 'Enter the Dragon',
          tags: ['kick'],
          actresses: ['Angela Mao'],
          videoId: '02a35655-e7f4-42a7-b71b-663ed17e95e7',
          dateUploaded: '2023-08-19T07:10:41.026',
          name: 'Angela Mao Kicks Men in the Balls in Enter the Dragon',
          views: 0,
          underage: false,
          collection: 'mainstreambb',
          customName: '',
          originalFileName:
            'Angela Mao Kicks Men in the Balls in Enter the Dragon (1973).mp4',
          addedDate: '2023-08-19T19:15:17.000Z',
          likes: 0
        },
        {
          _id: '64dfd396232edeb4cde7c99c',
          year: 1973,
          title: 'Girls Are for Loving',
          tags: ['object'],
          actresses: ['Cheri Caffaro'],
          videoId: '0d7a05da-f3ec-4697-a945-b2f5854e9a05',
          dateUploaded: '2023-08-18T04:17:25.713',
          name: "Cheri Caffaro Electrocutes a Man's Balls in Girls Are for Loving",
          views: 0,
          underage: false,
          collection: 'mainstreambb',
          customName: '',
          addedDate: '2023-08-18T20:24:54.000Z',
          likes: 0
        },
        {
          _id: '64dfd396232edeb4cde7c98f',
          year: 1974,
          title: 'Old Dracula',
          tags: ['knee'],
          actresses: ['Cathie Shirriff'],
          videoId: 'c67647b9-6b8e-4e25-8c54-c6adfc2a960a',
          dateUploaded: '2023-08-18T04:25:54.997',
          name: 'Cathie Shirriff Knees a Man in the Balls in Old Dracula',
          views: 0,
          underage: false,
          collection: 'mainstreambb',
          customName: '',
          addedDate: '2023-08-18T20:24:54.000Z',
          likes: 0
        },
        {
          _id: '64dee5c2482eccfa2bb818b4',
          year: 1974,
          title: 'Foxy Brown',
          tags: ['hit'],
          actresses: ['Esther Sutherland'],
          videoId: '741ef006-20a3-4f22-a6bb-89a7a81ab0b4',
          dateUploaded: '2023-08-17T18:23:02.294',
          name: "Esther Sutherland Slaps a Man's Balls in Front of Pam Grier in Foxy Brown",
          views: 0,
          underage: false,
          collection: 'mainstreambb',
          customName: '',
          addedDate: '2023-08-18T03:30:10.000Z',
          likes: 0
        },
        {
          _id: '64dc69c18b7b4fba21181009',
          year: 1974,
          title: 'The Arena',
          tags: ['kick'],
          actresses: ['Pam Grier'],
          videoId: '4295409e-031c-4e7b-840a-bcdaaf5c72f8',
          dateUploaded: '2023-08-15T22:13:56.701',
          name: 'Pam Grier Kicks a Man in the Balls in The Arena',
          views: 0,
          underage: false,
          collection: 'mainstreambb',
          customName: '',
          addedDate: '2023-08-16T06:16:33.000Z',
          likes: 0
        },
        {
          _id: '64dc69c18b7b4fba21181001',
          year: 1978,
          title: 'Foul Play',
          tags: ['verbal'],
          actresses: ['Marilyn Sokol'],
          videoId: '2d413e71-779a-42ef-a55d-ce79cec4893a',
          dateUploaded: '2023-08-15T22:18:17.322',
          name: 'Marilyn Sokol Verbal in Foul Play',
          views: 0,
          underage: false,
          collection: 'mainstreambb',
          customName: '',
          addedDate: '2023-08-16T06:16:33.000Z',
          likes: 0
        },
        {
          _id: '64dc4f6b00170b81b51282d6',
          tags: ['verbal', 'object'],
          actresses: [
            'Lada Edmund Jr',
            'Patricia Estrin',
            'Jo Ann Harris',
            'Jennifer Lee Pryor',
            'Lisa Moore',
            'Connie Strickland'
          ],
          year: 1974,
          title: 'Act of Vengeance',
          name: 'Lada Edmund Jr Teaches Patricia Estrin, Jo Ann Harris, Jennifer Lee Pryor, Lisa Moore, and Connie Strickland Self-Defense by Attacking a Mans Balls. They Each Take Turns Practicing on a Dummy in Act of Vengeance (1974).mp4',
          collection: 'mainstreambb',
          videoId: '46541c0b-cb86-4e70-8fe8-ff9fc5930ad1',
          dateUploaded: '2023-08-15T22:21:17.316',
          views: 0,
          underage: false,
          customName: '',
          addedDate: '2023-08-16T04:24:11.000Z',
          likes: 0
        },
        {
          _id: '64dc401f00170b81b51282ca',
          tags: ['knee'],
          actresses: ['Angie Dickinson'],
          year: 1974,
          title: 'Police Woman',
          name: 'Angie Dickinson Knees a Guy in the Balls in Police Woman 1x11.mp4',
          collection: 'mainstreambb',
          videoId: 'e9411bbd-ce0e-4ffa-92b6-070a790f94b3',
          dateUploaded: '2023-08-15T22:39:17.317',
          views: 0,
          underage: false,
          customName: '',
          addedDate: '2023-08-16T03:18:55.000Z',
          likes: 0
        },
        {
          _id: '64dc401f00170b81b51282ab',
          tags: ['knee'],
          name: 'Barbra Streisand Knees a Man in the Balls in the Owl and the Pussycat (1970).mp4',
          actresses: ['Barbra Streisand'],
          year: 1970,
          title: 'The Owl and the Pussycat',
          collection: 'mainstreambb',
          videoId: 'f8241da2-cb9f-4130-9000-5500da1bd02d',
          dateUploaded: '2023-08-15T22:35:17.322',
          views: 0,
          underage: false,
          customName: '',
          addedDate: '2023-08-16T03:18:55.000Z',
          likes: 0
        },
        {
          _id: '64dc401f00170b81b51282a4',
          tags: ['castration'],
          name: 'Dyanne Thorne Castrates a Man in Ilsa She Wolf of the SS (1975).mp4',
          actresses: ['Dyanne Thorne'],
          year: 1975,
          title: 'Ilsa She Wolf of the SS',
          collection: 'mainstreambb',
          videoId: '6f54f465-6ad3-473a-bdfe-82acd82dcc27',
          dateUploaded: '2023-08-15T22:32:17.444',
          views: 0,
          underage: false,
          customName: '',
          addedDate: '2023-08-16T03:18:55.000Z',
          likes: 0
        }
      ],
      tags: [
        {
          key: 'knee',
          count: 4
        },
        {
          key: 'kick',
          count: 4
        },
        {
          key: 'verbal',
          count: 2
        },
        {
          key: 'object',
          count: 2
        },
        {
          key: 'stomp',
          count: 1
        },
        {
          key: 'squeeze',
          count: 1
        },
        {
          key: 'nsfw',
          count: 1
        },
        {
          key: 'hit',
          count: 1
        },
        {
          key: 'castration',
          count: 1
        }
      ]
    })
    // cy.intercept(
    //   'GET',
    //   ' /api/search/filter/mainstreambb?&tags=squeeze&hideUnderage=true&eitherOr=or&sort=recent',
    //   getMainstreambbSqueeze
    // )
    // // cy.intercept(
    // //   'GET',
    // //   '/api/search/filter/mainstreambb?&tags=squeeze&eitherOr=or&sort=recent',
    // //   getMainstreambbSqueeze
    // // )
    // cy.intercept(
    //   'GET',
    //   '/api/search/filter/mainstreambb?&tags=squeeze,verbal&underage=false&eitherOr=or&sort=recent',
    //   getMainstreambbVerbalSqueeze
    // )
    // cy.intercept(
    //   'GET',
    //   '/api/search/filter/mainstreambb?&tags=squeeze,verbal&underage=false&eitherOr=and&sort=recent',
    //   getMainstreambbVerbalAndSqueeze
    // )
    // cy.intercept(
    //   'GET',
    //   '/api/search/filter/mainstreambb?&tags=squeeze&underage=false&eitherOr=and&sort=recent',
    //   getMainstreambbSqueezeAnd
    // )
    // cy.intercept(
    //   'GET',
    //   '/api/search/filter/mainstreambb?&actresses=Anna%20Faris&eitherOr=*',
    //   {
    //     gallery: getMainstreambb.gallery.filter((movie) =>
    //       movie.actresses.includes('Anna Faris')
    //     )
    //   }
    // )
    cy.visit('/mainstreambb')
  })
  it('displays the correct filters', () => {
    getMainstreambb.tags.forEach((setting) => {
      cy.contains(`${setting.key.toLowerCase()} (${setting.count})`)
    })
    // cy.contains('all').parent().should('have.class', 'Mui-disabled')

    cy.dataCy('switch').get('input').should('not.be.checked')
  })
  it('filter filters correctly', () => {
    cy.get('[class$="MuiChip-root"]').should(
      'have.length',
      getMainstreambb.tags.length
    )
    cy.dataCy('tag-chip-squeeze-true').should('not.exist')
    cy.dataCy('tag-chip-kick-true').should('not.exist')

    cy.dataCy('tag-chip-squeeze-false').click()
    cy.dataCy('tag-chip-kick-false').click()
    cy.dataCy('tag-chip-squeeze-false').should('not.exist')
    cy.dataCy('tag-chip-kick-false').should('not.exist')

    cy.dataCy('tag-chip-squeeze-true').click()
    cy.dataCy('tag-chip-squeeze-true').should('not.exist')
    cy.dataCy('tag-chip-squeeze-false')

    cy.dataCy('tag-chip-kick-true').click()
    cy.dataCy('tag-chip-kick-true').should('not.exist')
    cy.dataCy('tag-chip-kick-false')

    cy.dataCy('open-nav-drawer').click()
    cy.dataCy('filter-decade-menu-item').click()
    cy.dataCy('decade-1').click({ force: true })
    cy.get('[class$="MuiChip-root"]').should('have.length', 9)

    cy.dataCy('filter-actress-menu-item').click()
    cy.dataCy('actress-name-0').click({ force: true })

    // filter actress

    // cy.contains('squeeze').click()
    // cy.get('[data-cy^="card-"]').should('have.length', 9)

    // cy.contains('squeeze (6)')
    // cy.contains('verbal (1)')
    // cy.contains('nsfw (1)')
    // cy.contains('verbal').click()
    // cy.get('[data-cy^="card-"]').should('have.length', 8)
    // cy.get('[data-cy^="card-"]').each(($button, i) => {
    //   expect($button.attr('data-cy')).to.eq(
    //     `card-${getMainstreambbVerbalSqueeze.gallery[i]._id}`
    //   )
    // })
    // cy.contains('squeeze (6)')
    // cy.contains('verbal (3)')
    // cy.contains('nsfw (1)')

    // cy.get('.MuiSwitch-input').click()
    // cy.get('[data-cy^="card-"]').should('have.length', 1)

    // cy.contains('verbal (1)').click()
    // cy.contains('squeeze (2)').click()

    // cy.get('.MuiSwitch-input').click()
    // cy.dataCy('switch').get('input').should('not.be.checked')

    // cy.get('button').contains('#Zoe Saldana').click()

    // cy.contains('nsfw').click()
    // cy.dataCy(`card-${getMainstreambb.gallery[1]._id}`).should('exist')
    // cy.dataCy(`card-${getMainstreambb.gallery[0]._id}`).should('not.exist')
    // cy.get('[data-cy^="card-"]').should('have.length', 1)

    // cy.contains('all').parent().click()
    // cy.dataCy('switch').get('input').should('not.be.checked')
    // cy.contains('all').parent().should('have.class', 'Mui-disabled')

    // cy.get('button').contains('#Gina Gershon').click()
    // cy.get('.MuiChip-label').contains('Gina Gershon').click()

    // cy.get('.MuiChip-label').contains('Gina Gershon').should('not.exist')

    // cy.get('button').contains('#Gina Gershon').click()
    // cy.get('.MuiChip-label').contains('Gina Gershon')
    // cy.contains('all').parent().click()
    // cy.get('[data-cy^="card-"]').should('have.length', 10)

    // cy.get('.MuiChip-label').contains('Gina Gershon').should('not.exist')
  })
})
