/* 
*
CHAPTER 3.a Node.js and Express
*
*/

/* 
Intro

In this part we will focus on implementing functionality on the
  SERVER side
  --> Implement a simple REST API in Node.js using the Express library
  --> App data will be stored in a MongoDB database
  --> Finally we will deploy the app to the internet

BEFORE, the code running in the browser had to be transpiled to be
  compatible with all browsers
  --> NOW the JavaScript is in the backend can use the large majority
      of the latest features without having to transpile
*/

/* 
Express

Node's built-in http web server can be used but it doesn't scale well
--> Express is the most popular library to provide a easy-to-work-with
    abstraction for building a backend server

To have changes get saved without having to restart server, we will use 
--> nodemon
    Browser still needs to be refreshed but server can stay running
*/

/* 
Fetching a single resource


We can define parameters for routes in Express using the colon syntax
  :id

Store the parameter in a variable with
  request.params.{}

Find the single resource with 
  .find

    app.get('/api/notes/:id', (request, response) => {
      const id = request.params.id
      const note = notes.find(note => note.id === id)
      response.json(note)
    })
*/

/* 
Receiving Data

To access the data, we use the Express json-parser with the command
--> app.use(express.json())
    This will attach the JSON data of a request, transform it into 
      a JS object and attaches it to the body property of the req obj


Important sidenote
  Sometimes when you're debugging, you may want to find out what headers 
    have been set in the HTTP request. One way of accomplishing this is 
    through the get method of the request object, that can be used for 
    getting the value of a single header. The request object also has the 
    headers property, that contains all of the headers of a specific request.

  Problems can occur with the VS REST client if you accidentally add an
    empty line between the top row and the row specifying the HTTP headers.
    In this situation, the REST client interprets this to mean that all 
    headers are left empty, which leads to the backend server not knowing 
    that the data it has received is in the JSON format.
*/

/* 
Important things learned

forEach loop will iterate through every element
--> Can't return early while looping

Remeber:  filter expects a True/False result
          map expects a function to transform the object
*/

/* 
About HTTP request types

The HTTP standard recommends certain request types to be
1) safe
2) idempotent

Safety means that the executing request must not cause any 
  side effects in the server (i.e. changing the database) and
  must only return data that already exists in the server

  GET and HEAD methods ought to be considered "safe"

HEAD works exactly like a GET request but it does not return anything
  but the status code and response headers

All HTTP requests except POST should be idempotent
--> The side-effects of any # of identical requests is the same
      as a single request

POST requests are neither safe nor idempotent
*/

/* 
Middleware

json-parser is middleware, functions that can be used for handling
  request and response objects

Middleware is a function that receives 3 parameters
    const requestLogger = (request, response, next) => {
      console.log('Method:', request.method)
      console.log('Path:  ', request.path)
      console.log('Body:  ', request.body)
      console.log('---')
      next() --> Yields controls to the next middleware
    }

    Middleware is used with:
    app.use(requestLogger)

Middleware functions can be used before or after route event handlers
--> Before: If we want them to be executed before the event handlers
--> After: If no route handles the HTTP request
*/