# Part 5
In this part we return to the frontend, first looking at different possibilities for testing the React code. We will also implement token based authentication which will enable users to log in to our application.

## **Login in frontend**
Last 2 parts focused on backend. The frontend doesn't implement the user management implemented in the last part.

Frontend now will
1) Showing existing notes
2) Let users toggle importance of note

A new note cannot be added since the backend now expects a token verifying a user's identity

### **Handling login**
The frontend will not display any notes if it's not connected to the backend. You can start the backend with npm run dev in its folder from Part 4. This will run the backend on port 3001. While that is active, in a separate terminal window you can start the frontend with npm start, and now you can see the notes that are saved in your MongoDB database from Part 4.

<br>

## **props.children and proptypes**
### **Displaying the login form only when appropriate**
We can set a Component to be hidden/shown with a click of two buttons
```javascript
<button onClick={() => setLoginVisible(true)}>log in</button>

<button onClick={() => setLoginVisible(false)}>cancel</button>
```
then giving the componenent an **inline** style rule corresponding with a state variable
```javascript
const hideWhenVisible = { display: loginVisible ? 'none' : '' }
const showWhenVisible = { display: loginVisible ? '' : 'none' }

<div style={hideWhenVisible}>
  // button
</div>

<div style={showWhenVisible}>
  // button
</div>
```

### **The components children, aka. props.children**
We are going to create a new **Togglable** component that can wrap around other componenets
* Helps with reusability/flexibility

```javascript
<Togglable buttonLabel='login'>
  <LoginForm
    username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}
  />
</Togglable>
```
Notice that this Togglable Component has both opening and closing tags
* LoginForm is considered a ***CHILD COMPONENT*** of **Togglable**

</br>

### Togglable Component
```javascript
import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
```

**{props.children}** refers to the child component of a component
* props.children is a builtin prop
* When a component uses a **/>** closing tag, props.children = []

### **State of the forms**
Here we restructure how we implement states when dealing with multiple components
* React documentation:
  * *Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.*

The App component does NOT actually need the contents of a new note before it has been created
* Thus, we can move the form's value/event handler to its respective component and just pass the **createNote** function from the App component

### **References to components with ref**
Now we want to hide the Note Form after creating a new note
* Problem: the visibility of the form is controlled with the Togglable Component...

How can a Child Component get access to its Parent Component's *visible* variable?
* **ref** mechanism of React gives us a reference to the component
* ```javascript
  import { useState, useEffect, useRef } from 'react'

  const App = () => {
    // ...
    const noteFormRef = useRef()

    const noteForm = () => (
      <Togglable buttonLabel='new note' ref={noteFormRef}>
        <NoteForm createNote={addNote} />
      </Togglable>
    )

    // ...
    }
  ```

* **useRef** hook creates a *noteFormRef* ref that is assigned to the *Togglable* component containing the Note Form

Changes to the Togglable Component
```javascript
import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, ref) => {
  ...

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (...)
})
```
* The function that **creates** the wrapping/parent component is wrapped inside of a **forwardRef** function call
* The wrapping component then uses the **useImperativeHandle** hook to make its toggleVisibility function available **outside** the component
* Now inside the App component, we can toggle the visibility by calling **noteFormRef.current.toggleVisibility()**

### **PropTypes**
Expected and required props of a component can be defined with the **prop-types** package
```javascript
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ..
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
  // Functions: PropTypes.func.isRequired
}
```
### **ESlint**
Adding to the frontend (backend has already been installed)
* Create-react-app installs ESlint
* install **eslint-plugin-jest** as a dev dependency
* Create *.eslintrc.js* file
* Create *.eslintignore* file 
* Create *eslint* script

If a Component doesn't have a name
```javascript
Togglable.displayName = 'Togglable'
```

### Important ESLint Settings
```javascript
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },

  'rules': {
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off'
  }
```

<br>

## **Testing React Apps**
Packages to use
* Jest
* react-testing-library (renders components for testing)
  * ```javascript
    npm install --save-dev @testing-library/react @testing-library/jest-dom
    ```
* jest-dom (installed in line above) adds some Jest-related helper methods

### **Rendering the component for tests**
imports for *src/components/Note.test.js*
```javascript
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'
```

render a component
```javascript
render(<Note note={note} />)
```

access the rendered component with the object screen
```javascript
const element = screen.getByText('Component testing is done with        react-testing-library')
expect(element).toBeDefined()
```

### **Running tests**
Create-react-app is set to run tests in **watch mode** by default which means the ```npm test``` command will not exit after finishing and instead wait for changes

How can I run tests "normally"
```bash
CI=true npm test
```

### **Searching for content in a component**
Can use ```querySelector``` on the ```{container}``` object returned by ```render```
```javascript
const { container } = render(<Note note={note} />)

const div = container.querySelector('.note')
expect(div).toHaveTextContent(
  'Component testing is done with react-testing-library'
)
```

### **Debugging tests**
Prints out the HTML of a component to terminal
```javascript
import { render, screen } from '@testing-library/react'
...
screen.debug()
```
vvv
```bash
console.log
  <body>
    <div>
      <li
        class="note"
      >
        Component testing is done with react-testing-library
        <button>
          make not important
        </button>
      </li>
    </div>
  </body>
```

Printing a specific element is possible too
```javascript
const element = screen.getByText('Component testing is done with react-testing-library')

screen.debug(element)
```

### **Clicking buttons in tests**
What is the library that helps test user input?
```user-event```
```bash
npm install --save-dev @testing-library/user-event
```

#### ***Testing functionality in practice***
```javascript
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

// ...

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  // event handler
  const mockHandler = jest.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  // "session" is started
  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  // All mock functions have this special ".mock" property where data about the function is kept (how it was called, what it returns, etc.)
  expect(mockHandler.mock.calls).toHaveLength(1)
})
```

### **Testing the forms**
Simulating text input with ```userEvent```
```javascript
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = jest.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  // Gets access of the input field with getByRole
  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...' )
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...' )
})
```

### **About finding the elements**
If there are multiple text inputs in the form, there are a few different ways to extract it into a variable
```javascript
const inputs = screen.getAllByRole('textbox')

await user.type(inputs[0], 'testing a form...' )

-----

const input = screen.getByPlaceholderText('write here note content')

-----

const input = container.querySelector('#note-input')
```

Important: ```getByText``` looks for an element with the **same exact** text as is given  
  
To find an element that *contains* text we can
```javascript
// Add 'exact' parameter
const element = screen.getByText(
'Does not work anymore :(', { exact: false }
)
```
```javascript
// findByText (Returns a PROMISE)
const element = await screen.findByText('Does not work anymore :(')
```
```javascript
// queryByText (Doesn't raise an exception if the element is not found)
// Can be used to make sure something is NOT RENDERED to the component
test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})
```

### **Test coverage**
Integrated coverage reported built into Jest that returns a report
```bash
CI=true npm test -- --coverage
```


### **Learned during 5.13-5.16 exercises**
* Add 'globals' to .eslintrc.js to permit use of 'undefined' variables (Jest functions)
* Coding convention for Functions and Variables use camelCasing
* Mimick (mock) a component's event handler(s) with ```jest.fn()```
  * ```const mockHandler = jest.fn()```
* Instantiate container and other local variables in ```beforeEach```
  * ```container = render(<Blog user={user} blog={blog} updateBlog={mockUpdateHandler} />).container```


### **Frontend integration tests**
Since the backend is fairly simple, we only wrote **Integration tests** to test its logic and connected the database through the backend API in Part 4

So far all the tests in this part have been unit tests for the frontend to validate the correct functioning of individual components


### **Snapshot testing**
Offered by Jest and does not need developers to define the tests themselves  

Tests are validated by comparing the HTML code before and after it has changed
* Developer defines what changes are desired/undesired


<br>

## **End to end testing**
So far...
* Backend: **Integration testing** on the whole backend API
* Frontend: **Unit tests** on components

Now...
* Backend + Frontend: **End to End tests**

E2E testing
* Browser
  * Headless browsers are browsers with no GUI
* Testing library
  * Selenium - Can be used with almost any browser
  * Cypress
* Very useful but with that, they are more challenging than unit/integration testing and can be quite slow & flaky (tests might pass & fail even when code doesn't change)

### **Cypress**
Has become one of the most popular recently

Install (frontend)
```bash
npm install --save-dev cypress
```
Script
```javascript
"cypress:open": "cypress open"
```

Cypress tests can be in the frontend OR backend repo (even in its own)

The system being tested must be running (unlike backend integration tests)

Script (backend)
```javascript
"start:test": "cross-env NODE_ENV=test node index.js"
```

Once both backend and frontend are running we can start Cypress
```javascript
npm run cypress:open
```

Structure of Cypress tests is similar to Jest
* *describe* blocks - group different test cases
* *it* method - defines test cases 
  * ```test('log in', () => {...})``` in Jest
* Cypress recommends arrow function declarations **NOT** be used and to opt for ```function() {...}```

***!!! Confused on Cypress start up***
* Integration directory isn't made
* New app? (doesn't look the same as notes)
* How to start frontend/backend before starting Cypress

* I installed Cypress 10.1, the notes use Cypress 9.6
  * Integration directory is made
  * Start backend ```$ npm run start:test```
  * Start frontend ```$ npm start```
  * Start Cypress (from frontend) ```$ npm run cypress:open```

#### **Cypress commands**
* describe blocks: group different test cases (like Jest)
* visit: opens the web address given as a parameter
* contains: searches for the string it received as a parameter from the page
* Example
```javascript
describe('Note app', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2022')
  })
})
```

### **Writing to a form**
Clicking a button can be chained 
* ```.contains(...).click()```

Selecting an element by CSS selector
* ```cy.get('input:first')```

Typing into a field
* ```cy.get('input:first').type('matthes3')```

Making HTTP request
* ```cy.request('POST', 'http://localhost:3001/api/testing/reset')```

### **Some things to note**
Give elements that have duplicate content CSS ID/Classes to select them more specifically

ESLint will throw a ```cy``` is not defined so we can install a dev dependency to ignore this
```gitbash
npm install eslint-plugin-cypress --save-dev
```
.eslintrc.js config
```js
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true,
        "cypress/globals": true
    },
    ...
    "plugins": [
      "react", "jest", "cypress"
    ],
}
```

### **Testing new note form**
Cypress runs tests in the order they are in the code

Each test starts from zero as far as the browser is concerned
  
### **Controlling the state of the database**
**Goal**: Have the database be the same each time we run tests to make the results reliable and easily repeatable  
**Challenge**: E2E tests do NOT have access to the database  
**Solution**: Create API endpoint to the backend for the test (/reset)

New router in /controllers (backend repo)
```javascript
const testingRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
```

It is a good idea to only start up that endpoint in 'test' mode
```javascript
// ...

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

Remember to start the app in 'test' mode
```javascript
npm run start:test
```

### **Failed login test**
When you want to focus on one test we can use ```it.only``` to only run that required test

We have been using ```.contains()``` to check for text content
* ```cy.get('.error').should('contain', ...)``` can be used to test for more diverse content

Cypress assertions  
https://docs.cypress.io/guides/references/assertions#Common-Assertions

Cypress testing CSS styles
```javascript
it('login fails with wrong password', function() {
  // ...

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')
})
```
* Cypress requires colors to be given as **rgb**
* Since all tests are for the same component, we can chain the tests

!!! Testing CSS properties on FireFox may behave differently
* Linked doc explains that testing ```border-style``` should be broken down to ```border-top-style, border-right-style, ... ```

### **Bypassing the UI**
Cypress recommends bypassing the UI (form) for logging in and instead prefers an HTTP request to the backend to login
* In our app we save details to the localStorage and Cypress can handle this
```javascript
describe('when logged in', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/login', {
      username: 'mluukkai', password: 'salainen'
    }).then(response => {
      localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
      cy.visit('http://localhost:3000')
    })
  })
```

Cypress offers **Custom Commands** to make code reusable
* Declared in cypress/support/commands.js
```javascript
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})
```
which then means we can use in our test files
```javascript
describe('when logged in', function() {
  beforeEach(function() {
    cy.login({ username: 'mluukkai', password: 'salainen' })
  })
```

createNote Custom Command
```javascript
Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url: 'http://localhost:3001/api/notes',
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  })

  cy.visit('http://localhost:3000')
})
```

### **How Cypress .contains() works**
Chaining ```.contains()``` will make it so the second ```.contains()``` call will **continue from within** the component found by the first call
* In the event that the HTML for a note is
* ```js
  <li className='note'>
    // test works with no <span>
    <span>{note.content}</span>
    <button onClick={toggleImportance}>{label}</button>
  </li>
  ```
* Chaining ```.contains()``` will break the test because there is no button *within* the span
  * We can fix this with the ```parent``` command and ```find``` (```get``` would search the whole page, so ```find``` is the correct command here)
  ```javascript
  it('one of those can be made important', function () {
    cy.contains('second note').parent().find('button').click()
    cy.contains('second note').parent().find('button')
      .should('contain', 'make not important')
  })
  ```
  repeated code above can be cleaned up with ```as``` command
  ```javascript
  it('one of those can be made important', function () {
    cy.contains('second note').parent().find('button').as('theButton')
    cy.get('@theButton').click()
    cy.get('@theButton').should('contain', 'make not important')
  })
  ```

When coding tests with Cypress, check the test runner to make sure the right components are being selected

### **Running and debugging the tests**
Cypress tests **cannot** run normal JavaScript code

Cypress commands are like promises so to access return values we use ```then```
```javascript
it('then example', function() {
  cy.get('button').then( buttons => {
    console.log('number of buttons', buttons.length)
    cy.wrap(buttons[0]).click()
  })
})
```

Set up Cypress debugger (only starts if Cypress test runner's dev console is open) 
https://docs.cypress.io/api/commands/debug

Intro to Cypress  
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Cypress-is-Not-Like-jQuery