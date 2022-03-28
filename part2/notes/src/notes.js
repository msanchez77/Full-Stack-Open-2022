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
	{ name: 'Fido', species: dog },
	{ name: 'Caro', species: dog },
	{ name: 'Ursula', species: cat },
	{ name: 'Jimmy', species: fish },
]

var isDog = (animal) => animal.species === 'dogs'

var dogs = animals.filter(isDog)
// 'reject' is another HOF
var others = animals.reject(isDog)

*/