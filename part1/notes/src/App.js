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
*/
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












export default App