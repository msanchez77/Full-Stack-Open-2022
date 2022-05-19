# Part 4

In this part, we will continue our work on the backend. 
Our first major theme will be writing unit and integration tests for the backend. After we have covered testing, we will take a look at implementing user authentication and authorization.

## **4.a Structure of backend application, introduction to testing**

### **Project Structure**


*utils*
* Creating your own logger.js is recommended
* logger.info .. logger.error
* module.exports = {info, error}

*config.js will contain environment variables*
* requires 'dotenv'
* module.exports = {MONGODB_URI, PORT}

*Custom middleware is moved to middleware.js*
* All console.logs are replaced with logger functions
* module.exports = {
      requestLogger,
      unknownEndpoint,
      errorHandler
    }


*controllers*
<br>
This will house the route handlers
* const notesRouter = require('express').Router()
<br> //...
<br> module.exports = notesRouter

Route handlers shorten from
* '/api/notes/:id' --> '/:id' with the help of a new file app.js which routes the app and connects to the database (Mongoose schema moved to /models)

Route handlers are in fact middleware and used
* const notesRouter = require('./controllers/notes')
<br>app.use('/api/notes', notesRouter)

<br>


### **Structure Responsibilities**

*index*: 
* http.createServer(app)
* requires app.js
* server.listen

*app*:
* Connects to MongoDB
* app.use
    * cors
    * express.static('build')
    * express.json()
    * middleware
    * Router object
    * '/api/notes', notesRouter
        * The router object
* module.exports = app

*build*:
* Built frontend

*controllers*:
* Route handlers
* const notesRouter = require('express').Router()
* const Note = require('../models/note')
    * Schema
* Since app uses the router with '/api/notes' we
    can use relative URL's in this file
* module.exports = notesRouter

*models*:
* Require mongoose
* Schema set up
* module.exports = mongoose.model('Note', noteSchema)

*utils*:
* config
* logger
* middleware
    * module.exports = { <Middleware functions> }

<br>

### **Testing Node applications**

Testing library to use: ***jest***
* Works well for testing backends and React apps

* npm install --save-dev jest

Remember:
* set testEnvironment to node for jest in package.json
* set jest to True in .eslintrc.js

Jest uses 'expect' and 'toBe' functions for testing
```
test('palindrome of react', () => {
        const result = reverse('react')

        expect(result).toBe('tcaer')
    })
```

Wrap test function with 'describe' to group tests into logical collections
```
describe('group name', () => {
    test(...)

    test(...)
})
```

<br>

## **PART 4.b Testing the backend**

### **Intro**
Unit tests are best utilized on more complicated logic

Our backend is relatively simple and doesn't contain complicated methods

We could use a local MongoDB to test with ***mongodb-memory-server***

Since our backend is relatively simple we will test the entire application
    through its REST API (the database is included)
* Testing multiple components of a system as a group is called
***integration testing***

<br>
 
### **Test environment**

Node convention is to define the execution mode of the application
    with the NODE_ENV env var

We'll change the package.json scripts to include this NODE_ENV
* "start": "**NODE_ENV=production** node index.js",
<br>"dev": "**NODE_ENV=development** nodemon index.js",
<br>"test": "**NODE_ENV=test** jest --verbose --runInBand"

Note:
* When deploying to Heroku, make sure cross-env is set to a production dependency
  * **npm i cross-env -P** : Add to 'dependencies' (default)
  * **npm i cross-env -D** : Add to 'devDependencies'

### **supertest**
Package to help us write tests for testing the API

Can be used to
1) Verify status codes
2) Verify headers
3) Verify format
4) Verify content

### **Initializing the database before tests**
Jest's **beforeEach** function can be used to reinitalize the database before a test is run
```javascript
beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
```

Other useful Jest functions
* toHaveLength
* toContain

### **Running tests one by one**
Run tests in a single file
```bash
npm test -- tests/note_api.test.js
```
Run tests/describe block with specific name
```bash
npm test -- -t "a specific note is within the returned notes"
```
Run tests that contains specified text 
```bash
// runs all tests that contain *notes* in their name
npm test -- -t 'notes'
```

### **async/await**
const notes = await Note.find({})
* Asynchronous actions being written like synchronous code
* Code pauses at *await* and waits until the promise is *fulfilled* and then continues

Asynchronous operations that are handled by await must return a promise
  
Must be written inside an **async** function
* const main = async () => {...}

### **async/await in the backend**
Database helper methods are useful to define in /tests directory (exporting the functions/dummy data)

### **Error handling and async/await**
How do you deal with async/await exceptions?
* try/catch

```javascript
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

### **Eliminating the try-catch**
We can eliminate the try/catch structure required for handling async/await exceptions with the help of the **express-async-errors** library
* All that needs to be done is import the library in *app.js*
  * require('express-async-errors')

Now the code block above can become
```javascript
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```
The try/catch structure is gone and the **next(exception)** call is handled by the library under the hood (exceptions are automatically passed to the error handling middleware)

### **Optimizing the beforeEach function**
```javascript
beforeEach(async () => {
  await Note.deleteMany({})
  console.log('cleared')

  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')
  // ...
}
```

This is a cleaner way of reinitializing the database before tests are run

However, this file's log will reveal an error
* cleared
* done
* entered test
* saved
* saved

The tests are ran before the database is done reinitializing

Now we have two options
1) Promise.all
    * ```javascript
      beforeEach(async () => {
      await Note.deleteMany({})

        const noteObjects = helper.initialNotes
          .map(note => new Note(note))
        const promiseArray = noteObjects.map(note => note.save())
        await Promise.all(promiseArray)
      })
      ```
    * noteObjects is assigned to an array of Mongoose objects
    * promiseArray is assigned to an array of PROMISES (created by .save())
    * Promise.all transforms an array of Promises to a single Promise and thus waits for every promise is fulfilled
      * We can still store the returned values (stored in same order)
        * ```javascript
          const results = await Promise.all(promiseArray)
          ```
      * Promise.all executes Promises in PARALLEL, so this wouldn't be suitable if order matters
2) for...of block
    * ```javascript
      beforeEach(async () => {
        await Note.deleteMany({})

        for (let note of helper.initialNotes) {
          let noteObject = new Note(note)
          await noteObject.save()
        }
      })
      ``` 

### **Things learned during exercises**
* .set('toJSON') and transform to reformat schema
  * _id is the default MongoDB identifier 
  * ```javascript
    blogSchema.set('toJSON', {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
      }
    })
    ```
* **await** on Mongoose operations
  * .save
  * .find
* Install **cross-env** to set NODE_ENV run mode (test, production, development)

### **Refactoring tests**


### **Learned after second exercises**
* configurations for debugging in VSCode
  * ```javascript
    "program": "${workspaceFolder}\\tests\\blog_api.test.js",
    "runtimeExecutable": "npm",
    "runtimeArgs": [
      "run-script", 
      "test", 
      "--", 
      "tests/blog_api.test.js"
    ],
    "port": 3003 
    ```
* Can add 'default' to Mongoose Schema
* Checking database before and after operations
  * ```javascript
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    ```
* Tests use 'api' (assigned to supertest(app)) to send requests NOT 'app'
  * Got stuck on this for a while
* Remember what is being returned by specific endpoints
* Remember to send data on PUT (& POST) requests

<br>

## **PART 4.c User administration**
### **Intro**
We want notes to be linked to the User who created it<br>
Deleting and editing a note should only be allowed for the creator

Users to notes is a One-to-Many relationship

In relational databases:
* We would use 2 separate database tables (Users / Notes) and a foreign key stored in the Notes table would dictate which User it belongs to
* **Join queries** would help with aggregating data from multiple tables

In document databases:
* We would use 2 collection tables and an object id would reference documents in the other collection
* Mongo doesn't support **join queries** (Starting from version 3.2 Mongo does support.. Not going to be used in this course)
  * To mimic join queries, we will implment it in our code by making multiple queries
  * Mongoose can take care of joining/aggregating data which gives the illusion of a join query, but it can also just make multiple queries too

### **References across collections**
Document databases are schema-less and the structure isn't self-evident as it is with Relational databases

With Document databses, the chosen schema depends on the application and the onus is on the developers to make design decisions

On average, Relational databases offer a more-or-less suitable way of organizing data for many applications

Options for our Notes collection and Users collection to work together:
* Users
  * **Add id's (can be plural) of notes that the User owns**
  * Nest the entire notes array
* Notes
  * Add id (singular) of User that added the note

### **Mongoose schema for users**
We will store the id's of the Notes created by the User in the User document

References will be stored in ***both*** documents
* Note will reference the User who created it
  * ```javascript
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
    ```
* User will have an array of references to all the Notes they created
  * ```javascript
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
      }
    ],
    ```

### **Creating users**
Users information
* Unique username
* Name
* passwordHash (One-way hash function) (generated with **bcrypt** package)

### **Creating a new note**
Changes to the notesRouter
* Add User model to /controllers/notes.js
* Add userId to POST request
* After saving the new note, we concat the noteId to the user

### **Populate**
Goal: Get the note contents when going to /api/users (just ID currently)
* In relational DB's it would be a join query
  * Join queries are *transactional* which means that the state of the DB isn't changed during the time that the query is made
* In document DB's, the looser restrictions means we can't guarantee that the state between the collections is consistent (it may change?)
  * Mongoose join is done with the **populate** method
    * ```javascript
      usersRouter.get('/', async (request, response) => {
        const users = await User
          .find({}).populate('notes')

        response.json(users)
      })
      ``` 

Populate will take the parameter ('notes') and after chaining from **find**, will take the 'notes' field of the user document (currently just the ID) and replace it with the contents of the matching ID of the Notes collection
* user Schema
  * ```javascript
    const userSchema = new mongoose.Schema({
      username: String,
      name: String,
      passwordHash: String,
      notes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Note'
        }
      ],
    })
    ```

Filtering populate to include specific fields
```javascript
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, date: 1 })

  response.json(users)
});
```


## **Token authentication**
Install **jsonwebtoken** library

### **Steps for logging in**
1) Find user in User collection
2) Use **bcrypt** compare function to check for password
  ```javascript
  password --> request.body
  user --> User.findOne({username})

  await bcrypt.compare(password, user.passwordHash)
  ```
3) Invalid user/password? --> 401 with error message
4) Valid user/password --> Create token object from username and user id
5) Sign the token with **jsonwebtoken** sign function and with a SECRET key from environment variable (can be any string)
6) Respond with 200 status and send {token, username, name}


### **Limiting creating new notes to logged in users**
Only allow new notes from a request with a valid token attached

We will set the Authorization header and the Authentication scheme to be used
* We will use the **Bearer** scheme

### **Problems of Token-based authentication**
We can add a token session timeout when calling **jwt.sign**
```javascript
const token = jwt.sign(
  userForToken, 
  process.env.SECRET,
  { expiresIn: 60*60 }
)
```

Another solution is to save info about each token to the backend database and check for each API request if the access rights attached the token is still valid --> **server side session**
* This increases the complexity in the backend and on performance since a validity check is needed for each API request
  * It is common to use a **key-value-database** like **Redis** to make these simple checks fast

Also, it is quite common to use ***cookies*** instead of an Authorization header for transferring the token between the client and server


## **Learned from part 4d exercises**
* When changing **_id** --> **id**, the code still uses **_id** but the JSON formatted string will display **id**
* When referring to another Schema (ref: <Schema>), remember to wrap the Schema with single quotes
* Mongoose .findOne() takes an Object
  * No argument in .findOne() will return the first document in the collection
* You CANNOT chain a field selector from a Mongoose find operation
  * ```javascript
    // Will NOT work
    const userId = await User.findById(decodedToken.id)._id

    // Will work
    const user = await User.findById(decodedToken.id)
    const userId = user._id 
    ```
  * Spent a lot of time debugging this
    * Debugger is helpful, but sometimes console.log will do the trick and using the VSCode REST client
* Checking error messages with Jest is case sensitive
  * ```javascript
    return response.status(401).json({ error: 'token invalid' })
    vvv
    expect(result.body.error).toContain('missing')
    ```
* If using two middlewares, add both to the Router definition
  * I thought next() would call the one next in line, but that would only be if app.js was using it