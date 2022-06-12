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
