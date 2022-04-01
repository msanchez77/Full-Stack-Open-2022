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