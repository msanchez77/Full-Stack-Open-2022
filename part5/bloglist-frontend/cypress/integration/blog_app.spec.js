describe('Blog app', function() {
  let testUser = {
    name: 'Test User',
    username: 'testuser',
    password: 'test'
  }

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    // create here a user to backend
    cy.request('POST', 'http://localhost:3003/api/users', testUser)
      .then(response => {
        cy.visit('http://localhost:3000')
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
  })
})