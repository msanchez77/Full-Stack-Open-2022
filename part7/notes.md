# **Part 7**
Several themes to this part
* **React Router**
  * Divides the application into different views based on the URL
* Adding **CSS** to React apps
* Look under the hood of how **Webpack** works and use it to be able to configure the app ourselves (previously just been done through create-react-app)
* **Hook functions** and how to define a **custom hook**

<br>

## **React-router**
(Returning to React **without** Redux)

### **React Router**
```bash
npm install react-router-dom
```

In an old school web app, changing the page would require a HTTP GET request to render the corresponding HTML

In a SPA, we are always on the same page, and JS does the work of showing different "pages" (HTTP requests only made for fetching data)
* We will use ```react-router``` to give the illusion of navigating to different "pages" 

```javascript
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"

const App = () => {

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
      </div>

      <Routes>
        <Route path="/notes" element={<Notes />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <div>
        <i>Note app, Department of Computer Science 2022</i>
      </div>
    </Router>
  )
}
```
Things to note
* Conditional rendering is based on the url in the browser, and all the conditional components are placed as children of the ```Router``` component
* "Router" is actually BrowserRouter
* **Link components** will modify the address bar
  * ```<Link to="/notes">notes</Link>```
  * URL will change to what is specified in the ```to``` attribute
* Components rendered based on the URL are done with the **Route component**
  * ```<Route path="/notes" element={<Notes />} />```
  * Will render if the browser address is equal to the ```path``` attribute
* All Route components are wrapped in a **Routes component**
  * Renders the **first** component whose *path* matches the address bar

### **Parameterized route**
[Router v1](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v1.js)  
Clicking a ```<Note />``` now opens the *single* Note view by nesting a ```<Link>``` inside a ```li``` component and the ```<Link>``` is linked to a *parameterized route*
```javascript
const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2>
    <ul>
      {notes.map(note =>
        <li key={note.id}>
          <Link to={`/notes/${note.id}`}>{note.content}</Link>
        </li>
      )}
    </ul>
  </div>
)
```

The parameterized route is defined as a child of the ```Routes``` component
```javascript
<Routes>
    <Route path="/notes/:id" element={<Note notes={notes} />} />
    ...
</Routes>
```

Lastly, in the single ```Note``` component, we use React Router's ```useParams``` to access the address bar's parameter
```javascript
import {
  // ...
  useParams
} from "react-router-dom"

const Note = ({ notes }) => {
  const id = useParams().id
  const note = ...
  return (
    ...
  )
}
```

### **useNavigate**
Login functionality is done conditionally, checking if the ```user``` field of the state of the ```App``` component is set.  
If not the, login button is clickable

```javascript
<Router>
  <div>
    <Link style={padding} to="/">home</Link>
    <Link style={padding} to="/notes">notes</Link>
    <Link style={padding} to="/users">users</Link>
    {user
      ? <em>{user} logged in</em>
      : <Link style={padding} to="/login">login</Link>
    }
  </div>

  // ...
</Router>
```

The ```Login``` form uses a **new hook**, ```useNavigate```, to redirect the user on a successful login
```javascript
import {
  // ...
  useNavigate
} from 'react-router-dom'

const Login = (props) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    navigate('/')
  }

  return (
    ...
  )
}
```

Rules for hooks (e.g. ```useState```, ```useEffect```, ```useNavigate```, ```useParams```, etc.)
* **Not** to be called inside a **loop**
* **Not** to be called inside a **conditional expression**
* **Not** to be called in **any place that is not a function defining a component**

### **redirect**
Conditional redirect based on if a user is logged in or not
```javascript
<Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
```

### **Parameterized route revisited**
Right now, we are passing ALL the notes to the single ```<Note>``` component and this can be optimized

```javascript
<Route path="/notes/:id" element={<Note notes={notes} />} />  
```

We move the ```<Router>``` component outside of the ```<App>``` component to enable us to use the ```useMatch``` hook

```index.js```
```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
)
```

```App.js```
```javascript
import {
  // ...
  useMatch
} from "react-router-dom"

const App = () => {
  // ...

  const match = useMatch('/notes/:id')
  const note = match 
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        // ...
      </div>

      <Routes>
        // SINGLE NOTE PASSED
        <Route path="/notes/:id" element={<Note note={note} />} />
        ...     
      </Routes>   

      <div>
        <em>Note app, Department of Computer Science 2022</em>
      </div>
    </div>
  )
}  
```

Now the line to match the Notes id would be executed on each browser URL change
```javascript
const match = useMatch('/notes/:id')
```

<br/>

## **Custom hooks**
### **Hooks**
React offers 15 built-in hooks
* ```useState```
  * Persistent state as the application runs
  * Function to update the state (immutable)
* ```useEffect```
  * Function to be run either everytime the DOM reloads, or only on the first reload
* ```useImperativeHandle```
  * Allows components to provide their functions to other components

Hook-based APIs have started emerging (```react-redux```, ```react-router```)
* ```useSelector```
  * Access (redux) store's state objects
* ```useDispatch```
  * Dispatches actions given to it
* ```connect```
  * Older API from ```react-redux``` that was used before useSelector/useDispatch to connect a store's states and action creator functions to a component
  * Legacy apps might still use
* ```useNavigate```
  * Allows us to code in browser navigation through our App which affects the address bar
  * Helps with UX such as bookmarking and navigating backwards
* ```useMatch```
  * Matches a parameterized route to a variable to access 
    * Route data
    * Route params (e.g. /:id)

Hook rules/limitations
* Can't be called inside loops, conditions or nested functions
  * Always use at the top level of the React function
* Can't be called from inside **regular** JS functions
  * Always call from React **function components** or **custom hooks**

### **Custom hooks**
React allows us to use custom hooks which primary purpose is to facilitate the reuse of the logic used in components

**Custom hooks must start with ```use``` (e.g. useDispatch, useSelector)**

Custom hook of the simple counter App we worked with in part1
```javascript
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value, 
    increase,
    decrease,
    zero
  }
}
```
* Creates its own state with ```useState```
* Returns an object containing the value and functions to manipulate it

<br>

useCounter in use
```javascript
const App = (props) => {
  const counter = useCounter()

  return (
    <div>
      <div>{counter.value}</div>
      <button onClick={counter.increase}>
        plus
      </button>
      <button onClick={counter.decrease}>
        minus
      </button>      
      <button onClick={counter.zero}>
        zero
      </button>
    </div>
  )
}
```
* Custom hooks can be reused in the App
```javascript
const App = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>
      {left.value}
      <button onClick={left.increase}>
        left
      </button>
      <button onClick={right.increase}>
        right
      </button>
      {right.value}
    </div>
  )
}
```

So far, we have created forms with the **input** & **onChange** event to be kept in memory as states
```javascript
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [height, setHeight] = useState('')

  ...

  <form>
    name: 
    <input
      type='text'
      value={name}
      onChange={(event) => setName(event.target.value)} 
    /> 
    <br/> 
    birthdate:
    <input
      type='date'
      value={born}
      onChange={(event) => setBorn(event.target.value)}
    />
    ...
  </form>
```

<br>

<span style="font-size:larger;">W</span>ith custom hooks, we can define our own custom ```useField``` hook that will simplify this state management
```javascript
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}
```
* Receives the ```type``` as a parameter and defines its own state and onChange handler
* Returns all of the attributes required by the ```input``` (type, val, onChange)

<span style="font-size:larger;">F</span>rom here we can create a stateful object and pass it to the ```input``` with much fewer lines
```javascript
const App = () => {
  const name = useField('text')
  // ...

  return (
    <div>
      <form>
        <input
          type={name.type}
          value={name.value}
          onChange={name.onChange} 
        /> 
        // ...
      </form>
    </div>
  )
}
```

### **Spread attributes**
<span style="font-size:larger;">S</span>ince we have all the attributes needed by the ```input```, we can utilize the spread syntax to pass them all with the following:
```<input {...name} />```

Same result
```javascript
<Greeting firstName='Arto' lastName='Hellas' />

const person = {
  firstName: 'Arto',
  lastName: 'Hellas'
}

<Greeting {...person} />
```

<br>

Now we can see the application in a much simpler, reusable, and modular form
```javascript
const App = () => {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  return (
    <div>
      <form>
        name: 
        <input  {...name} /> 
        <br/> 
        birthdate:
        <input {...born} />
        <br /> 
        height:
        <input {...height} />
      </form>
      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  )
}
```


### **Learned through 7.4-7.8 exercises**
* Use an empty dependency arry ([]) for useEffect for **data fetching**
  * Thousands of requests results from having either of the ```useCountry``` hook's objects (e.g. [notes, persons] or [noteService, personService])
* Reminder: ```axios``` is the requests library
  * Chain ```then``` and ```catch``` for requests
* Using spread operator on a custom hook to attach to an ```<input>``` tag's attributes
  * Separate the two categories to spread easily
    * ```javascript
      return {
        inputAttr: {
          type,
          value,
          onChange
        },
        method: {
          reset
        }
      }

      vvv
      const info = useField('text')

      <input 
        {...info.inputAttr}
      />
    ``` 
* Specify a ```<button>``` type attribute 
  * ```type='submit'``` will trigger the ```<form onSubmit={handleSubmit}>```
  * ```type='reset'``` will attach to another custom ```onClick```