# **Part 6**
This part focuses on the Redux library which manages the state of React applications. We will use it to move the Application's state & State Logic outside React components. This is advisable when applications grow larger and larger

## **Flux-architecture and Redux**
So far: 
* State and State handler methods are placed in the Root componenet of the application
* State and its handler methods passed to other componenets with props

Next:
* Use Redux library to move the state logic & state itself OUTSIDE of React components

### **Flux-architecture**
Flux architecture makes state management easier

State is placed into its own **stores**
State in the store is NOT changed directly, but rather with different **actions**

### **Redux**
Redux works with the same principle as Flux architecture, but is a bit simpler (even Facebook uses Redux)

#### **[Redux Overview](https://redux.js.org/tutorials/fundamentals/part-1-overview)**
* Store is the center of every Redux application and is a container that holds the global state
* JS Object with a few special functions and abilities
  * Never directly modify or change the state that is kept inside the Redux store
  * To update --> Create a plain **action** object and **dispatch** it to the store to tell it what happened
    * When an action is dispatched, the store runs the root **reducer** function which creates the new state based on the old state and action
  * Finally, the store notifies **subscribers** of the updated state so that the View can be updated

**Main idea behind Redux**: A single centralized place to contain the global state in your application and specific patterns to follow when updating the state to make the code predictable

#### **Actions**
```js
const addTodoAction = {
  // Unique descriptive name to use in Reducer function
  // Usually "feature/specific event"
  type: 'todos/todoAdded',
  // additional fields can be added depending on action
  payload: 'Buy milk'
}
```

#### **Reducers**
```javascript
const initialState = { value: 0 }

function counterReducer(state = initialState, action) {
  // Check to see if the reducer cares about this action
  if (action.type === 'counter/incremented') {
    // If so, make a copy of `state`
    return {
      ...state,
      // and update the copy with the new value
      value: state.value + 1
    }
  }
  // otherwise return the existing state unchanged
  return state
}
```

Similar to an **event listener** but is conditional based on the action type passed to it

Must follow:
* New state is a result of the *state* and *action* arguments
* Never directly modify/change state
* NO asynchronous logic, randomness, or other "side effects"
  * Must be deterministic

#### **Store**
```javascript
import { configureStore } from '@reduxjs/toolkit'

// Reducer passed
const store = configureStore({ reducer: counterReducer })
// Store method that returns current state value
console.log(store.getState())
// {value: 0}
```

#### **Dispatch**
```javascript
// Store method to update the state with an action object
// ONLY WAY TO UPDATE THE STATE
store.dispatch({ type: 'counter/incremented' })

console.log(store.getState())
// {value: 1}
```

The **event trigger** in the application

### **Back to FSO**
Customary to use **switch** commands rather than **if** statements
```javascript
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default: // if none of the above matches, code comes here
      return state
  }
}
```

Reducers are never supposed to be called directly, but instead as a parameter to the ```createStore``` function
```javascript
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  // ...
}

const store = createStore(counterReducer)
```

Now the store uses the reducer to handle actions  
Actions are ```dispatched``` to the store with
```javascript
store.dispatch({type: 'INCREMENT'})
```

When the state is changed, a ```subscribe``` method is used to create callback functions that the store calls
```js
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```

### **Pure functions, immutable**
Testing will be done with the ```deep-freeze``` library which ensures that the reducer has been correctly defined as an **immutable** function
```javascript
npm install --save-dev deep-freeze
```

Ensures that the reducer does not change the state of the store given to it
```deepFreeze(state)```



### **Uncontrolled forms**
An uncontrolled form is one where its fields are NOT bound to the state of the App component
* CANNOT generate dynamic error messages
* CANNOT disable the submit button based on input

An method handler can access the content of a field with a **name** attribute
```javascript
addNote = (event) => {
  const content = event.target.note.value
}

...

<form onSubmit={...}>
  <input name="note" />
  <button type="submit">add</button>
</form>
```

### **Action Creators**
**React components do not need to know Redux action types and forms**  
--> So we can use ```action creators``` which are functions that create actions
```javascript
const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}

USAGE
    store.dispatch(createNote(content))

    store.dispatch(toggleImportanceOf(id))
```


### **Forwarding Redux-Store to various components**
Here we will start separating code into their approriate modules with the help of the ```hooks-api of the react-redux``` library

```index.js``` becomes
```javascript
...

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  // Application is now defined as a child of a PROVIDER component
  // while passing in the 'store' as a prop
  <Provider store={store}>
    <App />
  </Provider>
)
```

Action creators can be moved to the ```reducer``` file and exported **NORMALLY** rather then **DEFAULT**
* **A module can have only one default export, but multiple "normal" exports**
  * ```js
    export const createNote = (content) => {
      // ...
    }

    export const toggleImportanceOf = (id) => { 
      // ...
    }
    ```
  * Normal exports are imported with curly braces
    * ```js
      import { createNote, toggleImportanceOf } from './reducers/noteReducer'
      ```

**If the application has many components which need the store, the App-component must pass store as props to all of those components.**

We can use the ```useDispatch``` from ```react-redux``` to dispatch the action creators imported from the ```reducer``` file

```javascript
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  // ...

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id))
  }

  // ...
}
```

* useDispatch will provide **ANY** React component with the dispatch function of the ```store``` given in ```index.js```
  * Allows all components to make changes to the state of the redux-store

We can use the ```useSelector``` hook to access the notes stored in the store
```javascript
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  // ...
  const notes = useSelector(state => state)
  // ...
}
```
* ```state => state``` is shorthand for ```(state) => {return state}``` as the ```useSelector``` hook receives a *function* as a parameter to either search for or select data from the redux-store
  * ```state => state``` returns the *whole state*
* More interesting selector
  * ```javascript
    const importantNotes = useSelector(state => state.filter(note => note.important))  
    ```

### **More components**
Here we continue separating modules into their own components
* NewNote
  * The New Note Form that employs ```useDispatch()```
  * Has handler that calls the action creator ```createNote(content)```
* Notes/Note
  * Both in same file
  * Notes -> **Container** component
    * Employs ```useDispatch()```
    * Pulls the state data with ```useSelector(state => state)````
  * Note -> **Presentational** component
    * Gets passed the ```note``` + ```eventHandler``` for toggling importance
* App becomes very simple
  * ```javascript
    const App = () => {
      return (
        <div>
          <NewNote />
          <Notes />
        </div>
      )
    }
    ```

