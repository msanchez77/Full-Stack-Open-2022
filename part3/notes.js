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




/* 
*
CHAPTER 3.b Deploying app to internet
*
*/

/* 
Same origin policy and CORS 

We can allow requests from other origins by using
  Node's cors middleware

npm install cors

const cors = require('cors')
app.use(cors())
*/

/* 
Application to the Internet

Add file 'Procfile'
--> Tells Heroku how to start the application
--> web: npm start

Keep Heroku logs open at all times
--> heroku logs -t

If deploying from a git repo where your code is NOT
  the main branch (altering an existing repo)
  --> heroku create
      git push heroku HEAD:master
*/

/* 
Frontend production build

For Create-React-Apps: npm run build
--> Now we have a few options to deploying the 
      frontend
*/

/* 
Serving static files from the backend

Copying the production build (build dir) to the root
  of the backend repo and configure the backend to 
  show the frontend's main page (build/index.html)
*/

/* 
Process for deploying from Heroku

part3/notes
--> npm install cors
    --> const cors = require('cors')
        app.use(cors())
--> Procfile
    --> web: npm start
--> heroku create
--> commit to Heroku git
--> git push heroku HEAD:master
--> To serve static files
    --> app.use(express.static('build'))
--> Can change baseUrl's to relative

part2/notes
--> npm run build
--> move /build to part3/notes

Streamline build
    "build:ui": "rm -rf build && cd ../../part2/notes/ && npm run build && cp -r build ../../part3/notes",
    "deploy": "git push heroku HEAD:master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && npm run deploy",    
    "logs:prod": "heroku logs --tail"

Proxy for working in development mode (npm start)
--> For Create-React-App's we can add a proxy
      to package.json of frontend repo

  "proxy": "http://localhost:3001"

*/

/* 
Pushing changes to git/heroku

Currently I was adding/commiting changes then pushing
  to Heroku. The changes were still being tracked
  but wasn't pushed to Git yet.
*/





/* 
*
CHAPTER 3.c Saving data to MongoDB
*
*/

/* 
Debugging Node applications

Chrome
1) node --inspect index.js
2) Click green icon
3) Set breakpoints in "Sources"
*/

/* 
MongoDB

MongoDB is a document database and one of the main categories of
  NoSQL databases

Document databases have lower complexity than relational DB's (SQL)
*/

/* 
MongoDB - Databases and Collections

1) Create a Database
    use myNewDB
    db.myNewCollection1.insertOne( { x: 1 } )

    If a database does not exist, MongoDB will create one on the first
    call to insertOne

2) Create a Collection
    db.myNewCollection2.insertOne( { x: 1 } )
    db.myNewCollection3.createIndex( { y: 1 } )

    Collections can be created on the calls above

  a) Explicit Creation
      db.createCollection()
      Can set maximum size, doc validation rules, etc.

3) Document Validation
    By default, a collection does not require all documents to 
      follow the same scheme (same fields, data types, etc.)
    Can be set during update and insert operations
    
4) Modifying Document Structure
    You can update the documents to a new structure (new fields, 
      remove fields, change data types)
  
5) Collection Identifiers
    Collections are assigned an IMMUTABLE UUID
    Can be retrieved with listCollections or db.getCollectionInfos()
*/

/* 
MongoDB - Documents

Data records are stored as BSON documents
  https://bsonspec.org/
  Binary repr of JSON with more data types

Example)
      var mydoc = {
               _id: ObjectId("5099803df3f4948bd2f98391"),
               name: { first: "Alan", last: "Turing" },
               birth: new Date('Jun 23, 1912'),
               death: new Date('Jun 07, 1954'),
               contribs: [ "Turing machine", "Turing test", "Turingery" ],
               views : NumberLong(1250000)
            }

      _id:          ObjectId type
      name:         embedded document w/ fields first and last
      birth/death:  Date type
      contribs:     array of strings
      views:        NumberLong type


Field names are strings
  _id is reserved for primary key
  Cannot contain 'null'
*/

/* 
MongoDB - Dot Notation

Arrays are ZERO-BASED indexed
  Retrive fields with "<array>.<index>"

Embedded documents
  "<embedded document>.<field>"
*/

/* 
MongoDB - Document Field Order

Unlike JS objects, BSON objects are ORDERED

{a: 1, b: 1} is equal to {a: 1, b: 1}
{a: 1, b: 1} is not equal to {b: 1, a: 1}

"Projection operators" : $project, $addFields, $set, and $unset
--> Reordering may occur
*/


/* 
Schema

A Schema in MongoDB is like a JSON object that outlines the object
  structure

  const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
  })

  const Note = mongoose.model('Note', noteSchema)


Document databases like Mongo are **schema-less**
--> Database can store documents with completely different fields
      in the same collection
--> The schema is given at the application level

*/

/* 
Creating and saving objects

New objects are made from the created Model
  const note = new Note({
    content: '...',
    date: new Date(),
    important: false
  })

Objects are saved with Mongoose's .save() and an event handler can be
  attached to with .then()

Ultimately (either in .then() or somewhere else) you will want to close
  your connection
  --> mongoose.connection.close()
*/

/* 
Fetching objects from the database

Print all documents in a collection Note

  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })

{} will get ALL of the notes
We can add search conditions with MongoDB operators
-->https://www.mongodb.com/docs/manual/reference/operator/


*/


/* 
Backend connected to a database

Mongo will return a "versioning field __v" when printing out documents
  from a collection so we can modify it with toJSON

    noteSchema.set('toJSON', {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    })

***** VERY IMPORTANT for organizing and analyzing your collections/docs
*/

/* 
Database configuration into its own module

Directory name : /models
public interface of the module is defined by setting a value to the
  module.exports variable

    module.exports = mongoose.model('Note', noteSchema)

  variables like "mongoose" and "url" won't be accessible from outside
    /models/note.js

Import into index.js --> const Note = require('./models/note')

Avoid hardcoding the database address and instead pass it through
  env variables

  npm install dotenv
  create .env file at root of project and .gitignore it
  --> MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
      PORT=3001
  .env file is used with expression
  --> require('dotenv').config()
  --> process.env.MONGODB_URI

*/

/* 
Using database in route handlers


*/

/* 
Learned during exercises

app.use(express.static('build'))
--> causes my server module to run the built frontend
      from /build
*/


/* 
***** REFRESHER ON FILES PIPELINE *******

Frontend:
--> Created first
--> Used to run the server on it as well
    --> npm run server
--> We can run the frontend from 
    --> npm run dev
--> Build FROM  backend repo w/ script : /build

Backend:
--> Node server
--> /requests ... Procfile ... mongo.js .. /models
--> npm start (static files)
--> npm run dev (nodemon) (changes on refresh)
--> Above scripts will use the HTML found in /build
    --> app.use(express.static('build'))
--> Deployable to Heroku
    -->   "build:ui": "rm -rf build && cd ../../part2/notes/ && npm run build && cp -r build ../../part3/notes",
          "deploy": "git push heroku HEAD:master",
          "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && npm run deploy",
          "logs:prod": "heroku logs --tail"

General:
--> Dependencies
    --> Backend
      -->   "dependencies": {
                "cors": "^2.8.5",
                "dotenv": "^16.0.0",
                "express": "^4.17.3",
                "mongoose": "^6.3.1"
              },
    --> Frontend
      -->    "dependencies": {
                "axios": "^0.26.1",
                "cross-env": "^7.0.3",
                "react": "^17.0.2",
                "react-dom": "^17.0.2",
                "react-scripts": "5.0.0",
                "web-vitals": "^2.1.4"
              },
              "devDependencies": {
                "json-server": "^0.17.0"
              }
--> Responsibilities 
  --> Frontend
    --> HTML, CSS, React, axios, States (react)
    --> Before was using dummy servers
      --> json-server
  --> Backend
    --> Node, Express (server), CORS (cross-scripting)
    --> MongoDB, MongoDB /models

*/


/* 
Error handling

Use status code 400 for a malformatted request
*/

/* 
Moving error handling into middleware

To execute the Error Handler Middleware, provide a parameter to a 
  next() call e.g. .catch(error => next(error))
  --> No parameter would simply move onto the next route or middleware

Express Error Handlers are middleware that accepts 4 parameters
--> error, request, response, next

Remember to have a 'next' argument to endpoint routing call
--> app.get('/api/notes/:id', (request, response, next) => ...

Error Handling Middleware MUST BE the LAST LOADED middleware

*/

/* 
The order of middleware loading

json-parser middleware ( app.use(express.json()) ) should be among
  the first middleware to be loaded

Unsupported route handling should be done AFTER supported routes and
  before the error handler
--> Think of the unsupported as a catch/else for route handling
--> No routes or middleware (excl. Error Handler Middleware) 
      will be called after the unknown response handler
*/

/* 
Other MongoDB operations

findByIdAndRemove(request.params.id)

findByIdAndUpdate(request.params.id, note, { new: true })
--> note is a regular JS object with new content
--> { new: true } By default the response will contain the object
      that was replaced. Setting { new:true } will return the new Object

*/

/* 
Thing learned Exercises 3.15-3.18

Node module exports are different than ES6

Getting MongoDB collections count is troubling me
*/