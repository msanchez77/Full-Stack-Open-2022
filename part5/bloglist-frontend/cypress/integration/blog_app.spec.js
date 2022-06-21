describe('Blog app', function() {
  let testUser = {
    name: 'Test User',
    username: 'testuser',
    password: 'test'
  }

	let testUser2 = {
    name: 'Other User',
    username: 'otheruser',
    password: 'other'
  }

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    // create here a user to backend
    cy.request('POST', 'http://localhost:3003/api/users', testUser)
      .then(response => {
        cy.request('POST', 'http://localhost:3003/api/users', testUser2)
					.then(response => {
						cy.visit('http://localhost:3000')
					})
      })
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('.login-btn-open').click()
    cy.contains('username')
    cy.contains('password')
    cy.get('input[name="Username"]')
    cy.get('input[name="Password"]')
  })



  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      // Command to make POST request to /login
      cy.get('.login-btn-open').click()
      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('test')
      cy.get('button[type="submit"]').click()

      cy.contains('Test User logged in')
      cy.contains('logout')
    })

    it('fails with wrong credentials', function() {
      cy.get('.login-btn-open').click()
      cy.get('input[name="Username"]').type('fakeuser')
      cy.get('input[name="Password"]').type('fake')
      cy.get('button[type="submit"]').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'border-width', '2px')
        .and('have.css', 'border-color', 'rgb(255, 0, 0)')
    })
  })



  describe('When logged in', function() {
    beforeEach(function() {
      // log in user here
      cy.login(testUser)
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()

      cy.contains('create new')

      cy.get('.title-input').type('Cypress Test')
      cy.get('.author-input').type('Test User')
      cy.get('.url-input').type('http://localhost:3000')

      cy.get('.create-blog-btn').click()

      cy.get('.blog-info-wrapper').contains('Cypress Test')
    })

		it('A blog can be liked', function() {
			const token = Cypress.env('token')
			const authorization = `bearer ${token}`

			const params = {
				title: "Test Liking Blog",
				author: "Test User",
				url: "http:localhost:3333",
				likes: 0,
				token: authorization
			}

			cy.addBlog(params)

			cy.contains('view').click()
			cy.get('.blog-likes').contains('0')
			cy.get('.blog-likes button').click()
			cy.get('.blog-likes').contains('1')
		})

		it('Remove button is there for user who added it; Log out and in with new user --> No remove button', function() {
			const token = Cypress.env('token')
			const authorization = `bearer ${token}`
			cy.addTestBlog({authorization})

			cy.contains('Dummy')
			cy.get('.blog-view-btn').click()
			cy.get('.blog-remove-btn')

			cy.contains('logout').click()
			cy.login(testUser2)
			cy.get('.blog-view-btn').click()
			cy.get('.blog-remove-btn').should('not.exist')
		})

		it.only('Check blogs are ordered by likes', function() {
			const token = Cypress.env('token')
			const authorization = `bearer ${token}`
			
			let params = {
				title: "First",
				author: "Test User",
				url: "http:localhost:3333",
				likes: 0,
				token: authorization
			}

			cy.addBlog(params)

			params = {
				title: "Second",
				author: "Test User",
				url: "http:localhost:3333",
				likes: 2,
				token: authorization
			}

			cy.addBlog(params)

			params = {
				title: "Third",
				author: "Test User",
				url: "http:localhost:3333",
				likes: 4,
				token: authorization
			}

			cy.addBlog(params)

			cy.get('.blog-info-wrapper').eq(0).should('contain', 'Third')
			cy.get('.blog-info-wrapper').eq(1).should('contain', 'Second')
			cy.get('.blog-info-wrapper').eq(2).should('contain', 'First')

			cy.get('.blog-view-btn').eq(1).click()
			let second_like_btn = cy.get('.blog-info-wrapper').eq(1).get('.blog-likes button')
			second_like_btn.click()
			cy.get('.blog-likes').contains('3')
			second_like_btn = cy.get('.blog-info-wrapper').eq(1).get('.blog-likes button')
			second_like_btn.click()
			cy.get('.blog-likes').contains('4')
			second_like_btn = cy.get('.blog-info-wrapper').eq(1).get('.blog-likes button')
			second_like_btn.click()
			cy.get('.blog-likes').contains('5')

			cy.get('.blog-info-wrapper').eq(0).should('contain', 'Second')
		})
  })
})