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


## **More about styles**
Two ways of adding styles to our App (so far)
1. Single CSS file
2. Inline-styles
   * ```js
      const Footer = () => {
      const footerStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
      }
      return (
        <div style={footerStyle}>
          ...
        </div>
        )
      }
      ``` 

### **Ready-made UI libraries**
Most popular UI framework: **Bootstrap**

Many others have been released recently

Helpful since they offer developers with ready-made themes and "components" like buttons, menus, and tables (not React)

Usually utilized by including the CSS stylesheet and JS script

Some UI frameworks offer React-friendly versions where the "components" have been turned into actual React components
* **reactstrap**
* **react-bootstrap**

We will cover and add to our React-router app
* Bootstrap (react-bootstrap)
* MaterialUI

### **React Bootstrap**
```javascript
npm install react-bootstrap
```

Load Bootstrap CSS in ```<head>```

```html
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
    crossOrigin="anonymous"
  />
  ```

Bootstrap looks for a **container** to render inside of  
We can add a ```className```: ```"container"``` and this will give the page some side padding

#### **Table**
Import the ```Table``` bootstrap component  
```js
import { Table } from 'react-bootstrap
```

```javascript
<Table striped>
  <tbody>
    {notes.map(note =>
      <tr key={note.id}>
        <td>
          <Link to={`/notes/${note.id}`}>
            {note.content}
          </Link>
        </td>
        <td>
          {note.user}
        </td>
      </tr>
    )}
  </tbody>
</Table>
```

#### **Forms**
```js
import { Form } from 'react-bootstrap
```
```javascript
<Form onSubmit={onSubmit}>
  <Form.Group>
    <Form.Label>username:</Form.Label>
    <Form.Control
      type="text"
      name="username"
    />
    <Form.Label>password:</Form.Label>
    <Form.Control
      type="password"
    />
    <Button variant="primary" type="submit">
      login
    </Button>
  </Form.Group>
</Form>
```

#### **Notification**
```js
import { Alert } from 'react-bootstrap
```
```javascript
const [message, setMessage] = useState(null)

return (
  <div className="container">
    {(message &&
      <Alert variant="success">
        {message}
      </Alert>
    )}
    // ...
  </div>
)

```

#### **Navigation structure**
```js
import { Navbar, Nav } from 'react-bootstrap
```
```javascript
<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/">home</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/notes">notes</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/users">users</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        {user
          ? <em style={padding}>{user} logged in</em>
          : <Link style={padding} to="/login">login</Link>
        }
      </Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>
```
<br>

### **Material UI**
```javascript
npm install @mui/material @emotion/react @emotion/styled
```

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  // ...
</head>
```

#### **Container**
```javascript
import { Container } from '@mui/material'

const App = () => {
  // ...
  return (
    <Container>
      // ...
    </Container>
  )
}
```

#### **Table**
```javascript
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {notes.map(note => (
            <TableRow key={note.id}>
              <TableCell>
                <Link to={`/notes/${note.id}`}>{note.content}</Link>
              </TableCell>
              <TableCell>
                {note.user}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
```

#### **Form**
Uses the ```TextField``` and ```Button``` components
```javascript
      <form onSubmit={onSubmit}>
        <div>
          <TextField label="username" />
        </div>
        <div>
          <TextField label="password" type='password' />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </div>
      </form>
```
* Notice how the HTML ```<form>``` element is still used

#### **Notification**
```javascript
<div>
  {(message &&
    <Alert severity="success">
      {message}
    </Alert>
  )}
</div>
```
* Similar to Bootstrap

#### **Navigation structure**
```javascript
<AppBar position="static">
  <Toolbar>
    <Button color="inherit" component={Link} to="/">
      home
    </Button>
    <Button color="inherit" component={Link} to="/notes">
      notes
    </Button>
    <Button color="inherit" component={Link} to="/users">
      users
    </Button>   
    {user
      ? <em>{user} logged in</em>
      : <Button color="inherit" component={Link} to="/login">
          login
        </Button>
    }                              
  </Toolbar>
</AppBar>
```

### **Styled Components**
Library that uses the **tagged template literals** introduced in ES6 to define styles
```javascript
npm install styled-components
```

Example
```javascript
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
`
```
* Applied to ```button``` and ```input``` elements 
* Inside of backticks
* Can then be used as regular elements (now styled)
```javascript
const Login = (props) => {
  // ...
  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username:
          <Input />
        </div>
        <div>
          password:
          <Input type='password' />
        </div>
        <Button type="submit" primary=''>login</Button>
      </form>
    </div>
  )
}
```

A growing library that has been found to be a practical way of styling React applications


<br>

## **Webpack**
Webpack is one of the key players in making the process of creating a React app so much simpler  

We will now look under the hood so that we can understand how it is configured and customize it ourselves

### **Bundling**
Code that is modularized must be bundled for older browsers (```npm run build```)
* ```index.html``` is the "main" file that loads the bundled JS file with a ```<script>``` tag
  * Also the CSS file
* ```index.js``` is considered the entry point for the applications which dictates which code is imported first and so on


**Exercise**: Create a suitable webpack configuration for a React app by hand from scratch


1) Create directory for project
```javascript
├── build
├── package.json
├── src
│   └── index.js
└── webpack.config.js
```
2) Install ```webpack```
```javascript
npm install --save-dev webpack webpack-cli
```
3) ```webpack.config.js```
```javascript
const path = require('path')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  }
}
module.exports = config
```
4) Script in ```package.json```
```javascript
"scripts": {
  "build": "webpack --mode=development"
},
```
5) Basic ```index.js```
```javascript
const hello = name => {
  console.log(`hello ${name}`)
}
```
6) Running ```npm run build``` will create a file based on the configs in ```webpack.config.js``` --> ```/build/main.js```
7) Basic ```App.js```
```javascript
const App = () => {
  return null
}

export default App
```
8) Import ```App``` into ```index```
```javascript
import App from './App';

const hello = name => {
  console.log(`hello ${name}`)
}

App()
```
9) Running ```npm run build``` shows that both files are now acknowledged


### **Configuration file**
```javascript
const path = require('path')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  }
}

module.exports = config
```

* Target directory ('output/path') needs an *absolute path*
* path.resolve transforms a sequence of paths to an absolute path
* __dirname: Global variable in Node; Stores path to current directory

### **Bundling React**
Transform application into a **minimal** React application
```
npm install react react-dom
```

Basic ```index.js```
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Basic ```App.js```
```javascript
import React from 'react' // we need this now also in component files

const App = () => {
  return (
    <div>
      hello webpack
    </div>
  )
}

export default App
```

Basic ```index.html```
```javascript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="./main.js"></script>
  </body>
</html>
```

Bundling causes an error stating "an appropriate *loader* is needed to bundle ```App.js```

### **Loaders**
Webpack only knows how to deal with plain JavaScript so we must **specify** to webpack what needs to be process before
* The basic ```App.js``` we set up above uses JSX

```javascript
npm install @babel/core babel-loader @babel/preset-react --save-dev
```

Loaders are configured under the ```module``` property in the ```rules``` array of ```webpack.config.js```
```javascript
const config = {
  entry: '...',
  output: {
    ...
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
}
```
* **test**: Specify which files the loader will be used for
* **loader**: Which loader to utilize
* **options**: Parameters for the loader

<br>

**NOTE**: Bundled App's that use ```async/await``` might not render anything to some browsers because of deprecated solutions through babel  
-
It necessitates the install of two more missing dependencies
```javascript
npm install core-js regenerator-runtime
```
and import at the top of ```index.js```
```javascript
import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'
```

### **Transpilers**
**Transpile**: To transform code of one form into another
* We are transpiling JSX to JS with **Babel**
* All browsers don't support the latest features of ES7/6, thus transpiling helps with implementing the ES5 standard
* The transpilation process is configured with Babel plugins/presets (groups of pre-configured plugins)
  * ```@babel/preset-react```
    * Transpiling source code
  * ```@babel/preset-env```
    * Transpile code to make it compatible with ES5
    * ```
      npm install @babel/preset-env --save-dev
      ```

### **CSS**
CSS used by our App needs to use **css** and **style** loaders
```javascript
npm install style-loader css-loader --save-dev
```

```javascript
{
  rules: [
    {
      test: /\.js$/,
      ...
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
  ];
}
```
* **CSS loader**: Loads the CSS files
* **Style loader**: Generates and injects a style element that contains all the styles of the application
  * These two loaders will include the CSS in the ```main.js``` file so it does not need to be imported into the built ```index.html```

**Note**: CSS can be generated into its own separate file with the [```mini-css-extract-plugin```](https://github.com/webpack-contrib/mini-css-extract-plugin)


### **Webpack-dev-server**
We will now install ```webpack-dev-server``` to make it possible to load changes dynamically (instead of bundling->refresh)
```javascript
npm install --save-dev webpack-dev-server
```

```package.json```
```javascript
{
  "scripts": {
    "build": ...
    "start": "webpack serve --mode=development"
  },
}
```

```webpack.config.js```
```javascript
  devServer: {
    static: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
  },
```

Bundling is only done *in memory*, and live changes will be reflected

### **Source maps**
Source maps will help us with **debugging** by *mapping* the errors within the bundled executable to the original source code

```webpack.config.js```
```javascript
const config = {
  // ...
  devtool: 'source-map',
  // ..
};
```

### **Minifying the code**
We can utilize ```UglifyJS``` to dramatically optimize our build files
* Since Webpack v4, there is **no additional configuration** needed, and all that needs to be done is specifying the **mode** for the **build script** (development --> production)

```javascript
  "scripts": {
    "build": "webpack --mode=production",
    "start": "webpack serve --mode=development"
  },
```
* Code is transformed to remove comments, unnecessary whitespace, newline characters, and variable names replaced with a single character

### **Development and production configuration**
Set up servers
* **Local** ```json-server``` (port 3001)
* **Development** server will use [the heroku app](https://obscure-harbor-49797.herokuapp.com/api/notes)

Global variable (BACKEND_URL) is created in ```webpack.config.js```
* '**config**': **object --> function**
* '**env**': Variable for environment (not used yet...?)
* '**argv**' ('argv.**mode**'): Gets the mode of the instance **through the script** (i.e. 'production'/'development' from 'build'/'start' scripts respectively) 
  * ```
    "build": "webpack --mode=production",
    "start": "webpack serve --mode=development",
    ```

```DefinePlugin``` from webpack is used for defining **global default constants** that can be used in the bundled code
* We set the ```BACKEND_URL``` to be conditional on the **mode**
```javascript
const webpack = require('webpack')

const config = (env, argv) => {
  console.log('argv', argv.mode)

  const backend_url = argv.mode === 'production'
    ? 'https://obscure-harbor-49797.herokuapp.com/api/notes'
    : 'http://localhost:3001/notes'

  return {
    ...,
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]
  }
}

module.exports = config
```

Custom hook + Global variable constant
-
```javascript
const useNotes = (url) => {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    axios.get(url).then(response => {
      setNotes(response.data)
    })
  }, [url])
  return notes
}

const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const notes = useNotes(BACKEND_URL)

  // ...
  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick} >press</button>
      <div>{notes.length} notes on server {BACKEND_URL}</div>
    </div>
  )
}
```

**Note**: If the development and production configurations differ a lot, remember it is a good idea to [**separate the configuration**](https://webpack.js.org/guides/production/)
-

Run development server on ```json-server```
* http://localhost:3000/

Run production server on ```live-server```
* http://127.0.0.1:5500/webpack-configuration/build/index.html
* VS Code extension

Run production server on ```static-server```
* http://localhost:9080/
* ```npx static-server``` within **/build**
  * ```npx``` = Node **executable** (no install)
  * ```npm``` = Node **manager** (installs package)

### **Polyfill**
For applications to be **IE-compatible**, a ```polyfill``` is needed
* Polyfill **adds the missing functionality to older browsers**
* Ways to add
  1) **webpack and Babel** 
  2) [**existing polyfill libraries**](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills)

We will use the ```promise-polyfill``` library and add the simple to use code to ```index.js```
```javascript
import PromisePolyfill from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}
```
* Now the global ```Promise``` object will be implemented, if the browser doesn't support it


### **Eject**
An app initialized from create-react-app uses webpack behind the scenes

If you wish to revert to a **default configuration** and strip out the files from c-r-a, you can **eject** the project and the default config will be stored in ```/config``` and a modified ```package.json```

If possible, it is recommended to set up your own webpack config from the start
-