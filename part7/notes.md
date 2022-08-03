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
	* ```js
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react']
				}
			}
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

<br>

## **Class Components, Miscellaneous**
### **Class components**
We will now go over "old" React (pre-16.8 where ```hooks``` were introduced)

Main characteristics of a **class component**
1) [```constructor```](https://reactjs.org/docs/react-component.html#constructor)
   * Called **before** it is "rendered" for the first time to the initial DOM (AKA **mounted**)
   * Call ```super(props)``` if inheriting from ```React.Component```
   * Usually two purposes for React constructors
     * Initializing local state (```this.state```)
     * Binding event handler methods to an instance
   * Shouldn't call ```setState``` in the constructor
     * Assign to ```this.state``` instead 
       * All other methods that wish to update the state should use ```this.setState()``` (never assigning to ```this.state```)
2) ```this```
   * Properties and methods of the component are self-referenced with ```this``` 
3) ```render```
   * Required
   * Keep this function **pure** meaning that it **does not modify** component state, and returns the same result each time it's invoked
4) ```state```
    * Class components **contain only one state** with **multiple parts**
  	*
		```js
		this.state = {
			anecdotes: [],
			current: 0
		}
		```
	* 
5) ```setState```
  * Method to **update all** of state's properties
    * ```this.setState( {current: 3} )```
    * ```this.setState( {anecdotes: resonseData } )```
  * Rerenders the component (calls the ```render``` method)
6) ```lifecycle methods```
   	* ```componentDidMount()```
    	* The ```useEffect()``` of class components
        	* Fetch data
    	* Called immediately after a component is **mounted**


### **Organization of code in React application**
[Resource](https://medium.com/hackernoon/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed)

### **Frontend and backend in the same repo**
In this course, we **copied** the bundled frontend code into the backend repo and served that (part 4)

Another approach would be to deploy the frontend code separately
* [Next.js](https://nextjs.org/) 
* [Remix](https://remix.run/)

[Single repo structure](https://github.com/fullstack-hy2020/create-app) with ```/client``` & ```/server``` sub-directories for the frontend/backend

### **Changes on the server**
Changes (e.g. when blogs are added by other users to the bloglist service) or time-consuming computation to the backend need to be reflected on the frontend
* Naive approach: **polling** --> Repeated (```setInterval``` calls) requests to the  backend API
* Sophisticated
  * **WebSockets**: Two-way communication channel between browser and server
    * Just need to set up callback functions to **respond** to updates rather than **ask & receive**
    * **Not fully supported on all browsers**
  * **Socket.io** uses WebSocket API but with **fallback options** for less supported browsers

### **Virtual DOM**
React *rarely* or *never* directly manipulates the actual DOM

React creates a **virtual DOM** that is stored in system memory during runtime which then with ```ReactDOM```, outputs the virtual DOM to the real DOM
* When the **state is changed**, a **new virual DOM** is defined and React computes whats the most optimal way to update the DOM (instead of replacing the whole thing)

### **On the role of React in applications**
<img src="./notes-md-images/model-view-controller.png" alt="drawing" width="200"/>

* Model-View-Controller pattern

React is a *library* (not framework) whose domain is the **View**
* A *framework* like **Angular** is more of an all-encompassing Frontend MVC framework

React + Redux --> Flux architecture
* Business logic is handled using the Redux state and action creators
* Redux thunk takes the business logic to almost completely separated from React

Flux architecture adds overhead to the application
* A smaller application/prototype might benefit from using React as not just a UI library
* React Context API + ```useReducer``` is one solution to a centralized state management without the need of third-party libraries (redux) 
  * [Resource](https://www.simplethread.com/cant-replace-redux-with-hooks/)
  * Not suitable for an application with a lot of UI components

### **React/node-application security**
1) Injection
* Malicious text sent using a form in an application that can disrupt application processes
* Users can submit SQL strings to be unknowingly executed by an application
* Prevention
  * **parameterized queries**
  * NoSQL databases (e.g. mongoose) prevents them by sanitizing queries
2) Cross-site scripting (XSS)
* Injection of malicious JS code into a legit web app to be executed in the browser of another visitor of the web app
* Prevention
  * Make sure libraries are up-to-date
  * Check dependencies version status
	```js
	npm outdated --depth 0
	```
  * Update package.json with the help of the ```npm-check-updates``` tool
  ```js
	npm install -g npm-check-updates
	npm-check-updates
	ncu -u
	npm install
	```
	* Auditing the packages will check on the security of dependencies
	```js
	npm audit
	```
3) Broken Authentication (related - Broken Access Control)
4) Check and sanitize data from the browser
	* URL parameters
	* HTTP headers/cookies
	* User-uploaded files

**Helmet** is a helpful library that includes a set of **Middlewares** that eliminate some security vulnerabilities in **Express** apps
-

<br>

### **Current trends**
#### **1) Typed versions of JS**
JavaScript variables tend to have an annoying bug with the **dynamic typing**
* PropTypes is a mechanism to enforce type checking for props passed to React components

**Static type checking** verifies the program against some set of properties for all possible inputs
* TypeScript

<br>

#### **2) Server-side rendering, isomorphic applications and universal code**
1) **Server-side rendering**
* Servers doing the work of pre-rendering React components to send to the browser for the first time
* One motivation: SEO
2) **Isomorphic applications and universal code**
* IWA: An application that **renders on the front AND backend**
* UC: Code that can be executed in most environments (front and backend)

**Next.js** is a rising library that is implemented on top of React that makes universal applications more appealing

<br>

#### **3) Progressive web apps**
* Web apps that work as well as possible on EVERY platform
* Internet connection, screen size, etc. shouldn't hamper functionality or usability
* Create-react-app can create progressive apps with the PWA custom template
```js
npx create-react-app my-app --template cra-template-pwa
```
* Offline functionality is implemented with the help of **service workers**

<br>

#### **4) Microservice architecture**
So far we have made apps that had a **monolithic** backend
* **One** application making up a whole and **running on a single server**, serving only a few API endpoints
* Not scalable

**Microservice architectures** segment the backend to many **separate**, **independent** services that communicate via the network
* Each microservice's responsibility is for a **particular logical function**
* Pure microservice architectures do **NOT** share a database

Example from our bloglist app
* Microservice #1
  * Handling **user**
    * registration
    * authentication
* Microservice #2
  * Handling **blogs**
    * Adding blogs, removing blog, etc.


The use of microservices has steadily been gaining hype to be kind of a [silver bullet](https://en.wikipedia.org/wiki/No_Silver_Bullet) of today, which is being offered as a solution to almost every kind of problem. However, there are a number of challenges when it comes to applying a microservice architecture, and it might make sense to go [monolith first](https://martinfowler.com/bliki/MonolithFirst.html) by initially making a traditional all-encompassing backend. [Or maybe not](https://martinfowler.com/articles/dont-start-monolith.html). There are a bunch of different opinions on the subject. Both links lead to Martin Fowler's site; as we can see, even the wise are not entirely sure which one of the right ways is more right.

#### **Serverless**
Instead of having **processes** ran for even the smallest executable, **serverless** services allow **the execution of individual functions** in the **cloud**

Takes out the responsibility of managing a large-scale server and all that comes with it
* performance
* security
* updates
* size
* scale
* so much more

**AWS Lambda**
* Runs backend code in response to user events
* Different services
  * Object uploads --> Amazon s3 buckets
  * Updates --> Amazon DynamoDB tables
  * Data --> Amazon Kinesis streams
  * In-app activity
* Handles all the capacity scaling, patching, administration of the infrastructure, and provides performance reports
* Upload code (called a **Lambda function**) through a ZIP file, write code in the AWS IDE, or use function templates pre-built by Lambda for commonly used operations
* Can call other AWS services with the AWS SDK
* Choose AWS event sources (e.g. S3 buckets, DynamoDB) for your code to trigger an operation


<br>

### **Useful libraries and interesting links**
<!-- -->
<p>The JavaScript developer community has produced a large variety of useful libraries. If you are developing anything more substantial, it is worth it to check if existing solutions are already available.
Below are listed some libraries recommended by trustworthy parties.</p>
<p>If your application has to <strong>handle complicated data</strong>, <a href="https://www.npmjs.com/package/lodash">lodash</a>, which we recommended in <a href="/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-3-4-7">part 4</a>, is a good library to use. If you prefer functional programming style, you might consider using <a href="https://ramdajs.com/">ramda</a>.</p>
<!-- -->
<p>If you are handling times and dates, <a href="https://github.com/date-fns/date-fns">date-fns</a> offers good tools for that.</p>
<!-- -->
<p><a href="https://www.npmjs.com/package/formik">Formik</a> and <a href="https://final-form.org/react/">final-form</a> can be used to handle forms more easily.
If your application displays graphs, there are multiple options to choose from. Both <a href="http://recharts.org/en-US/">recharts</a> and <a href="https://github.com/highcharts/highcharts-react">highcharts</a> are well-recommended.</p>
<p>The <a href="https://github.com/facebook/immutable-js/">immutable.js</a> library maintained by Facebook provides, as the name suggests, immutable implementations of some data structures. The library could be of use when using Redux, since as we <a href="/en/part6/flux_architecture_and_redux#pure-functions-immutable">remember</a> in part 6, reducers must be pure functions, meaning they must not modify the store&#x27;s state but instead have to replace it with a new one when a change occurs. Over the past year, some of the popularity of Immutable.js has been taken over by <a href="https://github.com/mweststrate/immer">Immer</a>, which provides similar functionality but in a somewhat easier package.</p>
<p><a href="https://redux-saga.js.org/">Redux-saga</a> provides an alternative way to make asynchronous actions for <a href="/en/part6/communicating_with_server_in_a_redux_application#asynchronous-actions-and-redux-thunk">redux thunk</a> familiar from part 6. Some embrace the hype and like it. I don&#x27;t.</p>
<p>For single-page applications, the gathering of analytics data on the interaction between the users and the page is <a href="https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications">more challenging</a> than for traditional web applications where the entire page is loaded. The <a href="https://github.com/react-ga/react-ga">React Google Analytics</a> library offers a solution.</p>
<p>You can take advantage of your React know-how when developing mobile applications using Facebook&#x27;s extremely popular <a href="https://facebook.github.io/react-native/">React Native</a> library, which is the topic of <a href="/en/part10">part 10</a> of the course.</p>
<p>When it comes to the tools used for the management and bundling of JavaScript projects, the community has been very fickle. Best practices have changed rapidly (the years are approximations, nobody remembers that far back in the past):</p>
<ul>
<li>2011 <a href="https://www.npmjs.com/package/bower">Bower</a></li>
<li>2012 <a href="https://www.npmjs.com/package/grunt">Grunt</a></li>
<li>2013-14 <a href="https://www.npmjs.com/package/gulp">Gulp</a></li>
<li>2012-14 <a href="https://www.npmjs.com/package/browserify">Browserify</a></li>
<li>2015- <a href="https://www.npmjs.com/package/webpack">Webpack</a></li>
</ul>
<p>Hipsters seem to have lost their interest in tool development after webpack started to dominate the markets. A few years ago, <a href="https://parceljs.org">Parcel</a> started to make the rounds marketing itself as simple (which Webpack absolutely is not) and faster than Webpack. However, after a promising start, Parcel has not gathered any steam, and it&#x27;s beginning to look like it will not be the end of Webpack. </p>
<p>Another notable mention is the <a href="https://rome.tools/">Rome</a> library, which aspires to be an all-encompassing toolchain to unify linter, compiler, bundler, and more. It is currently under heavy development since the initial commit earlier this year on Feb 27, but the outlook sure seems promising.</p>
<p>The site <a href="https://reactpatterns.com/">https://reactpatterns.com/</a> provides a concise list of best practices for React, some of which are already familiar from this course. Another similar list is <a href="https://vasanthk.gitbooks.io/react-bits/">react bits</a>.</p>


## **Exercises**
### **Prettier Summary**
* Install VS Code extension: Prettier
* Add Prettier to project
  * ```npm install --save-dev --save-exact prettier```
* Make .json file to let the editor know Prettier is being used
  * ```echo {}> .prettierrc.json```
* Make .ignore file (can copy from .gitignore/.eslintignore)
  * ```touch .prettierignore```
* If using ESLint, install the ESLint plugin **eslint-config-prettier**
  * ```npm install --save-dev --save-exact eslint-config-prettier```
* Run plugin file on any file to check which ESLint rules are redundant and can be removed (since Prettier takes care of it)
  * ```npx eslint-config-prettier src/App.js```
* Now that the editor knows which files to ignore and that Prettier is configured, run ```write``` to format the project
  * ```npx prettier --write .```
* Lastly check to see if all files are formatted to Prettier specs
  * ```npx prettier --check .```

Add configuration to Prettier rules with a ```prettier.config.js``` file
* https://prettier.io/docs/en/configuration.html
* https://prettier.io/docs/en/options.html


## **Learned during part7f exercises**
* DON'T FORGET TO **DISPATCH** actions from components
* Thunk middleware gets access to the store methods ```dispatch``` and ```getState``` as parameters
  * **Thunks** are a pattern of writing **functions** with **logic inside** that can **interact** with a Redux store's **dispatch** and **getState** methods
```javascript
// BlogForm.js (component)
dispatch(createBlog({
  title: newTitle,
  author: newAuthor,
  url: newUrl,
}));

// blogReducer.js (Redux reducer)
export const createBlog = content => {
  return async (dispatch,getState) => {
    console.log(getState())
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}
```
  * The control flow happens like this
      1) Frontend form submit button click
      2) Component action creator *dispatches* asynchronous action creator from a state's reducer

* You CANNOT call ```useSelector``` inside of useEffect


## **Learned after exercise 7.18**
Revisited Jest+Supertest and the backend for this exercise

* Jest .send() takes an object so the field does NOT need to be in quotation marks 
  * MongoDB Operation DOES
    * ```js
      const result =  await Blog.findByIdAndUpdate(
                  request.params.id,
                  { $push: {"comments": body.comments} },
                  {new:true}
                );
      ```
* PAY ATTENTION TO STATUS CODE
  * I had set 204 because I didn't think I needed any content returned from the request
  * I wanted a response to check the updated blog (adding a comment) and the response given from the request was NOT what I was expecting. 
  * Expect ("Content-Type", /application\/json/) makes sure what to expect
    * I knew of this before but didn't bother adding it, causing extra time
* When sending a simple object, ```request.body``` (in a controllers file) will pull out the information
* MongoDB ```$push``` will CONCAT to an array 
  * Added before the update object
  * ```js
    await Blog.findByIdAndUpdate(
      request.params.id,
      { $push: {"comments": body.comments} },
      {new:true}
    );
    ```
* ```{new:true}``` will return the updated object
* ```{upsert:true}``` was an interesting option I found that will create a new object, if one doesn't match the ID (probably not recommended for comments)

## **Learned during exercise 7.19**
Disable ESLint rules for file (.eslintignore wasn't detecting?)
* ```.eslintrc.js```
  * ```js
    'overrides': [
      {
        "files": ["cypress/integration/*.spec.js"],
        "rules": {
          "no-undef": "off"
        }
      }
    ],
    ```

* Setting the Request headers as an object (supertest)
  * ```js
    .set({
      "Authorization": token,
      "Content-Type": "text/plain"
    })
    ```
* Sending simple text with ```Content-Type: text/plain```
  * Always look for different options of ones that you always use (application/json)
* 