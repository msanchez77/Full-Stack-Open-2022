/* 
*
CHAPTER 1.a Intro to React
*
*/

/*
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
*/

/* 
Array of components

const App = () => {
   return [
     <h1>Greetings</h1>,
     <Hello name="Maya" age={26 + 10} />,
     <Footer />
   ]
}
*/

/*
Wrap elements to be returned with an empty element
  return (
    <>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
*/





/* 
*
CHAPTER 1.b JavaScript
*
*/

/*
Why is Babel used?
Transpiling which is a process that allows older 
browsers to run JavaScript that it does not natively
support

(Done automatically with CRA [create-react-app])
*/

/* 
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // 4 is printed
console.log(t[1])     // -1 is printed

t.forEach(value => {
  console.log(value)  // numbers 1, -1, 3, 5 are printed, each to own line
})  
 */

/* 
Is it okay to change contents of a const array?

Yes, an array is just an object and its contents
can point to anything and change
*/

/* 
Why is it preferrable to use .concat() rather than
.push()?
Immutable data structures in functional programming
.concat() creates a new array with the added item
 */

/* 
How does map work?
It creates a new array for which the function
given as a parameter is used to create the
items
 */

/* 
Data Type: Objects
------------------
const object1 = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
}

const object2 = {
  name: 'Full Stack web application development',
  level: 'intermediate studies',
  size: 5,
}

const object3 = {
  name: {
    first: 'Dan',
    last: 'Abramov',
  },
  grades: [2, 3, 5, 3],
  department: 'Stanford University',
}

object1.name
object1['name']

object1.address = 'Helsinki'
object1['secret number'] = 12341

Objects can have methods (not gone over too much
  in FSO)
 */


/* 
Functions (which in JS are basically objects)

Arrow Functions
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}

What are the two ways to reference a function?

Function Declaration
function product(a, b) {
  return a * b
}

Function Expression
const average = function(a, b) {
  return (a + b) / 2
}

Both can be called the same, but the expression
can reside among the rest of the code
*/

/* 
Why does this course and "newer" JS lean towards
a "this-less" JavaScript?

Contrary to other languages, in JS the value of this
is defined based on **how the method is called**

const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  doAddition: function(a, b) {
    console.log(a + b)
  },
}

arto.doAddition(1, 4)        // 5 is printed

const referenceToAddition = arto.doAddition
referenceToAddition(10, 15)   // 25 is printed

arto.greet()       // "hello, my name is Arto Hellas" gets printed
const referenceToGreet = arto.greet
referenceToGreet() // prints "hello, my name is undefined"

setTimeout illustrates this unexpected behavior
setTimeout(arto.greet, 1000)
// prints 'hello, my name is JS Bin Output' (for JSBin)
// this refers to the global object and can and will
// not be what was originally intended
*/

/* 
Is it possible to preserve 'this' to its original
intention?

YES --> bind
setTimeout(arto.greet.bind(arto), 1000)
*/


/* 
Strict mode
Eliminates some JavaScript silent errors by changing
  them to throw errors.
Fixes mistakes that make it difficult for JavaScript
  engines to perform optimizations: strict mode code can sometimes be made to run faster than identical code that's not strict mode.
Prohibits some syntax likely to be defined in future
  versions of ECMAScript.

Makes 'this' refer to undefined
*/

/* 
'this' and Constructors
function Person(fName, lName) {
  this.fName = fName;
  this.lName = lName;
}

const person = Person("Jane", "Doe");
console.log(person); // prints undefined

If we weren't in strict mode, the global variable
(what 'this' usually refers to) would have two new
properties: fName, lName

We should use 'new' to construcct the Person object
const person = new Person("Jane", "Doe")
*/


/* 
Class syntax was introduced into JS with ES6

Can be controversial among developers since
JS is meant to be a class-free, Object-Oriented,
and functional programming language

Since JS only defines the types
Boolean, Null, Undefined, Number, 
String, Symbol, BigInt, and Object
--> variables constructed from a class is considered
--> an object

Useful to know since it's used in "old" Reacts and
in Node.js

In this course, it will not be used, preferring the 
new Hooks (https://reactjs.org/docs/hooks-intro.html)
*/





/* 
*
CHAPTER 1.c Component state, event handlers
*
*
/* 
Component Helper Functions
It is very common in JS to define functions
within functions

The nested function can directly access all props
passed to the component
*/


/* 
Destructuring props

const Hello = ({ name, age }) => {
}
*/


/* 
Stateful Component

import { useState } from 'react'
const [ counter, setCounter ] = useState(0)

  counter: "Preserves" some values between function
            calls to 'setCounter'
  setCounter: Function to be called to change state
              Re-renders page
*/


/* 
Event handlers are functions

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  
  const setToZero = () => setCounter(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}>
        zero
      </button>
    </div>
  )
}

An event handler is to be specified as either a
function or a function reference

<button onClick={setCounter(counter + 1)}>

This would be a function call and cause the page to 
continuously re-render

*/


/* 
Lifting State Up

In React, sharing state is accomplished by moving
  it up to the closest common ancestor of the
  components that need it. This is called 
  “lifting state up”

Instead of smaller components having their local state,
  it gets passed down through props
*/





/* 
*
CHAPTER 1.d A more complex state, 
*             debugging React apps
*
/* 

/* 
Complex state

What is the easiest and best way to maintaining
a complex state?
  A: Using the useState function multiple times to
      create separate "pieces" of state
*/


/* 
Object spread

  const newClicks = { 
    ...clicks, 
    left: clicks.left + 1 
  }

...clicks will create a new object that copies
all properties of the click object

Specifying any other properties will overwrite
*/


/* 
Mutating state directly (FORBIDDEN)

  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

  const handleLeftClick = () => {
    clicks.left++     // Mutating directly
    setClicks(clicks)
  }

    return (
      <div>
        {clicks.left}
        <button onClick={handleLeftClick}>left</button>
        <button onClick={handleRightClick}>right</button>
        {clicks.right}
      </div>

It is forbidden in React to mutate state directly

Changing state must be done by setting the state to 
a new object
*/


/* 
Handling Arrays

  // State array initialization
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

REMEMBER: .concat() creates a copy unlike .push() so
          use .concat() with State Arrays
*/


/* 
Conditional Rendering

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}
 */


/* 
Debugging in React

console.log('props is ', props)

DO NOT console.log('props is ' + props)

Adding "debugger" anywhere in the code will stop 
execution and you can check the value of variables, etc.
*/


/* 
Rules of Hooks

useState and useEffect can NOT be called in:
1) Loops
2) Conditional expressions
3) Any place that is not a function definining a component

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }
*/


/* 

*/













export default App