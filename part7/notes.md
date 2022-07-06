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

