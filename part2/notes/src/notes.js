/* 
Functional Programming with JavaScript
https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84
*/

/* 
Higher Order Functions

Remember in JavaScript: Functions are values

var triple = function(x) {
  return x * 3
}

We can pass this function into antoher function
--> triple : callback
--> higherOrderFunction(triple)

When we write our code in small simple functions
--> They compose together
--> We can re-use in other places

*/

/* 
'filter' is a common higher order function

var animals = [
  { name: 'Fido', species: 'dog' },
  { name: 'Caro', species: 'dog' },
  { name: 'Ursula', species: 'cat' },
  { name: 'Jimmy', species: 'fish' },
]

var isDog = (animal) => animal.species === 'dog'

var dogs = animals.filter(isDog)

// 'reject' in not a built-in function but its
  function will do the reverse of 'filter'
var others = animals.reject(isDog)


'find' is similar to 'filter' but will only return
  the first occurence of True
*/

/* 
Map

Unlike filter which expects True and False outputs,
Map expects its callback function to return a 
  transformed object that it will put in the new array
*/

/* 
Reduce (basic)

The multi-tool of list transformations

Useful to fallback on when no other built-in
  list transformation function fits your problem

var orders = [
  {amount: 250},
  {amount: 400},
  {amount: 100},
  {amount: 325}
]

var total = orders.reduce(function(sum, order) {
  return sum + order.amount
}, 0)

Notice the 2 arguments it takes 
  1) Compounding result
  2) Iterating element
*/

/* 
Reduce (advanced)

Above we saw how 'reduce' can transform an array 
  into a single number

'reduce' can have many more outputs such as
  another array or object


// Had to add "type": "module" to package.json to import
import fs from 'fs'

var output = fs.readFileSync('data.txt', 'utf8')
  .trim()
  .split('\r\n')
  .map(line => line.split('\t'))
  .reduce((customers, line) => {
    customers[line[0]] = customers[line[0]] || []
    customers[line[0]].push({
      name: line[1],
      price: line[2],
      quantity: line[3]
    })
    return customers
  }, {})

console.log(output)

Things learned here:
  1) trim() will remove linebreaks/spaces at the 
    start or end of a string
  2) customers[line[0]] = customers[line[0]] || []
    very helpful way to either initialize array
    or if already init'd --> skip
  3) push(): Remember this is the way to append to 
    the array
  3b) concat(): Create new object and append to that

  const zoo = ['🦊', '🐮'];
  const birds = ['🐧', '🐦', '🐤'];

  // pushing an array requires the spread syntax
  zoo.push(...birds);

  // concat does not
  const new = zoo.concat(birds);

  console.log(zoo); // ['🦊', '🐮', '🐧', '🐦', '🐤']
*/





/* 
*
CHAPTER 2.a Rendering a collection, modules
*
*/

/* 
Rendering Collections

Given a list of objects : notes
What can we do to wrap each element with an <li> so we don't hardcode
  notes.map(note => <li>{note.content}</li>)

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
*/

/* 
Key-attribute

Running the application from above will output a warning stating that
  "Each child in an array or iterator should have a unique 'key' prop"

  {notes.map(note => 
    <li key={note.id}> //React uses the key attributes to determine
    {note.content}			how to update the view on re-renders
    </li>
  )}

  ** Remember JavaScript and JSX MUST BE wrapped in {} **

When adding an element at the beginning of the children, React will
  inefficiently mutate every child.

Key attributes will solve this issue by matching the children to their key
*/

/* 
Retrieving Indices through 'map'

notes.map((note, i) => ...)

Second parameter of map can be assigned to index of element in array
*/

/* 
Refactoring Modules

Refactoring the App component to render a Note component
  const Note = ({ note }) => {
    return (
      <li>{note.content}</li>
    )
  }

  ...

  {notes.map(note => 
    <Note key={note.id} note={note} />
  )}

Notice how the 'key' attribute is defined in the Note component rather
than the <li> element
*/

/* 
Spreading Out Components to their own Modules

New Component Reminders:
  1) For smaller applications, we can put a directory of components in
      /src/components/
  2) export default <Component>
  3) import <Component> from './components/<Component>'

Modules have plenty of other uses other than enabling component declarations
  --> Will go over later in the course
*/


/* 
IMPORTANT DESIGN FOR GENERALIZING CONTENT

Making an array of objects into readable HTML elements has followed this
1) Parent Component passing the array
2) Transition Comoponent passing the .map() output to the single
    template component
3) Template Component feeds the content's information to its respective
    child component
4) Children Component output the HTML

*/


/* 
*
CHAPTER 2.b Forms
*
*/

/* 
Controlled component

A React component that controls the state of a form element (i.e.
  <input>, <textarea>, <select>)

Typically a form element maintains its own state and updated based
  on user input

*/

/* 
Debugging Components

<div>debug: {newName}</div>

Helpful to keep track of a State variable
*/



/* 
*
CHAPTER 2.c Getting data from server
*
*/
/* 
Intro 

Start json-server
npx json-server --port 3001 --watch db.json
*/

/* 
The browser as a runtime environment

JavaScript engines, or runtime environments (i.e. Chrome) follow
the asynchronous model, so all IO-operations are required to 
be executed as non-blocking

Event handlers are called some point after an asynchronous operation
is completed

JavaScript is single-threaded
--> It cannot execute code in parallel
--> Therefore it is important to use a non-blocking model so
  the browser doesn't "freeze" during one operation

The code logic needs to be such that no single computation can take 
too long
*/

/* 
Web Workers

Today, browsers run parallelized code with web workers
--> https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
--> The event loop of an individual browser window is still single thread

You can run whatever code inside a worker thread with some exceptions
--> No directly manipulating the DOM inside a worker
--> No using some default methods and properties of the 'window' object
*/

/* 
NPM

We have two options for pulling data from the server
1) fetch
--> promise based function that is standardized and supported 
  by all modern browsers
2) axis
--> external library that function like fetch and is more pleasant to use
--> Imported using NPM

** A "package.json" file indicates if a project is using NPM
*/

/* 
NPM Installs

Runtime dependency
--> An install that the program requires the 
  existence of the library

--> npm install axios

Development dependency
--> The program doesn't require it, instead it is
  used for assistance during software development

--> npm install json-server --save-dev
*/

/* 
Axios and promises

Remember: import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
--> .get() returns a promise
  --> A Promise is an object repr the eventual completion or failure
     of an asynchronous operation

A Promise has 3 distinct states
1) Pending: Final value is not available yet
2) Fulfilled: Operation completed, final value is available
  --> Generally means a successful operation
  --> Might be referred to as 'resolved'
3) Rejected: An error prevented the final value from being determined
  --> Generally means a failed operation

To access the contents of a Promise object, we must register an 
event handler to the promise using "then"

promise.then(response => {
  console.log(response)
})

--> response : {
    "data": ...,
    "status": 200,
    "statusText": "OK",
    "headers": {...},
    "config": {...},
    "request": {}
  }

response.data will contain the returned object (in our case the JSON)


It is usually unnecessary to store the promise object, and is instead 
common to chain the "then" method to "get"
--> axios
    .get('http://localhost:3001/notes')
    .then(response => {
      const notes = response.data
      console.log(notes)
    })
*/

/* 
Effect-hooks

Effect-hooks lets you perform side effects in function components
--> State hooks provided state to React components defined as functions
--> A side effect can be Data fetching, Setting up a subscription,
  manually changing the DOM

By default, Effect-hooks are run after every completed render
--> You can choose to fire it only when certain values are changed

Takes two parameters
1) A function (the effect itself)
2) An object to watch that the effect depends on
  --> Passing an empty array, [], will only run along the first render

*/

/* 
Learned after exercises

Remember to restart server after adding to .env

Asynchronous nature of useEffect requires a
  condition check for emptyness
--> Ex: Object.keys(weatherState).length !== 0
          State was initialized to {}
--> A show/hide button didn't need this since it is
  given time to fetch data

Can't 'return' in useEffect

Leave API calls in a useEffect to limit requests

Store fetched data in State variable since calling
  it's update function will re-render the DOM

Object.keys is powerful
--> Returns an array of Object's keys
--> Use with map to get array of values

Template strings use the backtick (`...`)
--> Format strings with ${...}
*/



/* 
*
CHAPTER 2.d Altering data in server
*
*/

/* 
Intro

Most API's (including json-server) don't actually use RESTful practices
    even though they claim they do

This part will focus on the conventional use of 
1) Routes (URLs)
2) HTTP request types
*/

/* 
REST

Individual data objects are referred to as resources

Resources are fetched from the server with HTTP GET requests
    /notes : List of all notes
    /notes/{id} : Individual note

Resources are added to the server with HTTP POST requests
    json-server expects a JSON formatted string and must contain
    a "Content-Type" request header --> "application/json" value
*/

/* 
Sending Data to the server

When posting a new object through a POST request, it is okay to
    omit the "id" property since the server will generate them
    causing less overhead

IMPORTANT: Now that we are using the server to effect our web app,
    we need to consider the challenges that come with it
    --> Asynchronicity of communication
    --> Relationship between JS runtime and React components
*/

/* 
Changing the Importance of Notes

The objects stored in the json-server can be modified in one of 
  two ways by making the HTTP request to the object's unique URL
  (http://localhost:3001/notes/${id})

  1) HTTP PUT : Replaces the entire note
  2) HTTP PATCH : Only changes some of the notes properties

To pull out a specific note based on id
--> const note = notes.find(n => n.id === id)
and edit
--> const changedNote = { ...note, important: !note.important }
*/

/* 
Extracting Communication with the Backend into a Separate Module

Exporting multiple functions from module as object of functions
	Assign to variabel first to remove runtime warning
	const exportObj = {
		getAll,
		create,
		update
	}

	export default exportObj;

*/

/* 
Promises Chaining (https://javascript.info/promise-chaining)

new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000); // (*)

}).then(function(result) { // (**)

  alert(result); // 1
  return result * 2;

}).then(function(result) { // (***)
})...

You can chain .then handlers off each other

A classic newbie error: technically we can also add many 
	.then to a single promise. This is not chaining.



Returning promises
--> Technically, a handler returns a "thenable" object
		which will be treated the same way as a promise, 
		but is designated for 3rd-party libraries with 
		"promise-compatible" objects that implement their
		own .then method

new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000);

}).then(function(result) {

  alert(result); // 1

  return new Promise((resolve, reject) => { // (*)
    setTimeout(() => resolve(result * 2), 1000);
  });

})
*/

/* 
Cleaner Syntax for Defining Obj Literals 

If you're creating an object where the property fields
	and variable names are the same, it is enough to write
	--> const person = { name, age }
	--> INSTEAD OF 	const person = {
										name: name,
  									age: age
									}
*/

/* 
Promises and Errors

Remember, a promise can be in one of three different states
1) Pending		2) Fulfilled		3) Rejected

A rejection of a promise is handled by either:
	a) A second callback provided to the "then" method
	b) More common --> catch method
	     axios
				.get('http://example.com/probably_will_fail')
				.then(response => {
					console.log('success!')
				})
				.catch(error => {
					console.log('fail')
				})

A catch method at the end of a Promise chain will 
  be called if ANY promise in the chain throws an error


*/


/* 
Learned after exercises

Components and keys
  Rule of thumb: Elements inside the map() need keys
	Ran into this when surrounding a child component in a div
	--> Both the Div and the Child Component (Person) needed a key

Still confused about bringing state to the same level and
  having to keep everything in App to manipulate state

	--> I have refactored my phonebook to now have each child 
				component (e.g. PersonForm, Filter, and Persons/Person)
				have their own file and passing state down from App
	--> Important to declare component methods INSIDE component
	--> Treat component as a class in OOP


*/



/* 
*
CHAPTER 2.e Adding styles to React app
*
*/

/* 
Inline styles

const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

<div style={footerStyle}>

Notice: CSS --> font-size
        JS  --> fontSize

Psuedo-classes (:hover, :active, :before, etc.. can't be used as inline)
*/

/* 
Inline styles and old conventions

Tradtionally it is considered best practice to separate CSS, HTML and JS
--> However in React since the separation of CSS, HTML and JS does not
      scale well with larger applications, the philosophy of React
      is to separate the application along the lines of logical
      functional entities (Components)

    React Components define the HTML, JS functions and Component's
      style all in one place
*/