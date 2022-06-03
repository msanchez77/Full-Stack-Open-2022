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