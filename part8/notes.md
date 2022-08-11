# **Part 8**
Graph QL
* Facebook's **alternative** to REST for communication between **browser** and **server**

## **GraphQL-server**
GraphQL's philosophy is vastly different than REST
* REST is *resource-based*
  * Every resource (user) has its own address which identifies it (/users/10)
  * Operations are deployed to resources through HTTP requests to the address
* GraphQL's principle is that the code on the browser forms a *query* describing the data wanted to send to the API (via POST request)
  * ALL QUERIES are sent to the **SAME ADDRESS** with request type POST


### Data Query
Goal: We would like to show a list of all the blogs that were added by users who have commented on any of the blogs we follow.
```gql
query FetchBlogsQuery {
  user(username: "mluukkai") {
    followedUsers {
      blogs {
        comments {
          user {
            blogs {
              title
            }
          }
        }
      }
    }
  }
}
```
* Interpretation:
  * Find a ```user``` "mluukkai"
  * For each of his ```followedUsers``` 
    * Find all their ```blogs```
    * For each ```blog```
      * Find all its (blog's) ```comments```
        * For each ```user``` who wrote a comment
          * Find their ```blogs```
            * Return title of each

Server response
```gql
{
  "data": {
    "followedUsers": [
      {
        "blogs": [
          {
            "comments": [
              {
                "user": {
                  "blogs": [
                    {
                      "title": "Goto considered harmful"
                    },
                    {
                      "title": "End to End Testing with Cypress is most enjoyable"
                    },
                    {
                      "title": "Navigating your transition to GraphQL"
                    },
                    {
                      "title": "From REST to GraphQL"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```
* Application logic is simple, and we get **exactly** the data we need with a single query


### **Schemas and queries**
*GraphQL Schema*
* Describes the queries the client can send to the server, what kind of parameters the queries can have, and what kind of data the queries return
* Example: 
  ```gql
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID! 
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
  ```
* Two **types** are defined here
  * *Person*
    * 5 fields
      * 4 String
        * '!' denotes if a field is required
      * 1 ID (Strings that GQL ensures are unique)
  * Query
    * **Practically every** GQL schema describes a query
    * Defines what kind of queries can be made to the API
    * *personCount*
      * No parameters
      * **Must** return an Integer
    * *allPersons*
      * No parameters
      * **Must** return a list and list **must** contain *Person* objects
    * *findPerson*
      * **Must** be given a string as parameter
      * Returns a *Person* object or *null* (No ! after Person)

### Simple Query (personCount)
```gql
query {
  personCount
}
```
Returns
```gql
{
  "data": {
    "personCount": 3
  }
}
```

### Slightly more complicated query (allPersons)
```gql
query {
  allPersons {
    name
    phone
  }
}
```
* The query can be made to return any field (i.e. city, street) described in the schema, as long as the returned data is a *Person* object
Returns
```gql
{
  "data": {
    "allPersons": [
      {
        "name": "Arto Hellas",
        "phone": "040-123543"
      },
      {
        "name": "Matti Luukkainen",
        "phone": "040-432342"
      },
      {
        "name": "Venla Ruuska",
        "phone": null
      }
    ]
  }
}
```

### Query with parameter (findPerson)
```gql
query {
  findPerson(name: "Arto Hellas") {
    phone 
    city 
    street
    id
  }
}
```

Returns
```gql
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "city": "Espoo",
      "street": "Tapiolankatu 5 A"
      "id": "3d594650-3436-11e9-bc57-8b80ba54c431"
    }
  }
}
```

This query is marked as **nullable** so if an unknown *Person* object is given as a parameter, the return data will show null
```gql
query {
  findPerson(name: "Joe Biden") {
    phone 
  }
}
```
Returns
```gql
{
  "data": {
    "findPerson": null
  }
}
```

### **Apollo Server**
Today's leading GraphQL server library

```javascript
npm install apollo-server graphql
```

An ```ApolloServer``` is given two parameters
```js
const server = new ApolloServer({
  typeDefs, --> GraphQL schema that defines *what* the data and queries are and contain
  resolvers, --> Object that defines *how* GraphQL queries are responded to
})
```
Resolver code
```javascript
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  }
}
```

### **Apollo Studio Explorer**
When the Apollo server is run in development mode, a ```localhost``` will open in your browser that has a button to open the **Apollo Studio Explorer**

### **Parameters of a resolver**
All resolvers are given **four parameters**
1) obj/root/parent (covered later in part 8)
2) **args**
  * Object containing the arguments passed into the query
  * findPersons(**name: "Arto Hellas"**)
    * findPersons defines the first parameter, **root**, but it is not needed
3) context (covered later in part 8)
4) info

### **The default resolver**
A GraphQL server **must define resolvers** for **each field** (name, phone, findPerson, personCount) of **each type** (Query, Person)

Default resolvers are defined if none are given (Person)
```javascript
const resolvers = {
  Query: {
    ...
  },
  Person: {
    name: (root) => root.name,
    phone: (root) => root.phone,
    street: (root) => root.street,
    city: (root) => root.city,
    id: (root) => root.id
  }
}
```
* Note how the object itself can be accessed through the first parameter 'root'

We could hard-code resolvers for certain fields (don't need to define all or nothing)
```javascript
Person: {
  street: (root) => "Manhattan",
  city: (root) => "New York"
}
```

### **Object within an object**
Modify schema by adding another type and make that type a field of another
```javascript
type Address {
  street: String!
  city: String! 
}

type Person {
  name: String!
  phone: String
  address: Address!
  id: ID!
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```
* The Persons in the server (array at top of index.js) still contains a street and city property, but now the response of a query contains an address object (containing street/city)
* Since the Persons in the server don't have an *address* field, the default resolver is not suffficient

```javascript
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  },
  Person: {
    address: (root) => {
      return { 
        street: root.street,
        city: root.city
      }
    }
  }
}
```

### **Mutations**
GraphQL operations which cause a change are done with **mutations** (type Mutation)  
</br>
**Mutation schema**
```javascript
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
}
```
* Parameters --> details of new Person
* Return --> Person || null
* Note: ID is not given as parameter. Leave that for server

Resolver must be defined for **each type**
```javascript
const { v1: uuid } = require('uuid')

// ...

const resolvers = {
  // ...
  Mutation: {
    addPerson: (root, args) => {
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}
```
* Person object is created from the args and ID is generated using uuid library
* New Person is concatenated to Persons array 
* New Person object is returned  
</br>

**Example of mutation operation**
```javascript
mutation {
  addPerson(
    name: "Pekka Mikkola"
    phone: "045-2374321"
    street: "Vilppulantie 25"
    city: "Helsinki"
  ) {
    name
    phone
    address{
      city
      street
    }
    id
  }
}
```
* Args are given and return value is explicitly described
* Note: The object saved to the Persons array will not have an address field, but the response to the mutation will 

## **Error handling**
GraphQL can handle some errors with validation (e.g. missing required arg for mutation), but stricter rules have to be added manually

Apollo Server has its own error handling mechanism which provides an ```errors``` array that contains each error that occurred
* message: String describing error
* locations: line/column of invoking code
* extensions: object containing additional useful info such as ```code``` and (in development mode) a stacktrace


Example of adding rule to not allow the same name in the phonebook
```javascript
const { ApolloServer, UserInputError, gql } = require('apollo-server')

// ...

const resolvers = {
  // ..
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find(p => p.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name,
        })
      }

      ...
    }
  }
}
```
* Checks to see if there is an entry in the persons array with the same name as the added Person
  * --> If there is, a **UserInputError** (GraphQL) is thrown


### **Enum**
Filtering a query to return persons with/without a phone number by using an **enum**  

**Schema**
```gql
enum YesNo {
  YES
  NO
}

type Query {
  personCount: Int!
  allPersons(phone: YesNo): [Person!]!
  findPerson(name: String!): Person
}
```

**Resolver**
```gql
Query: {
  personCount: ...
  allPersons: (root, args) => {
    if (!args.phone) {
      return persons
    }
    const byPhone = (person) =>
      args.phone === 'YES' ? person.phone : !person.phone
    return persons.filter(byPhone)
  },
  findPerson: ...
},
```
* The YesNo enum *is nullable*, so the first check is to see if the argument is provided and if not will just return all persons like before
* If the phone arg is defined to **YES**/**NO** then the ```byPhone``` function is used to filter the persons according to the arg given


### **Changing a phone number**
New mutation to change the phone number of a person

**Schema**
```javascript
type Mutation {
  addPerson(
    ...
  ): Person

  editNumber(
    name: String!
    phone: String!
  ): Person
}
```

**Resolver**
```javascript
Mutation: {
  // ...
  editNumber: (root, args) => {
    const person = persons.find(p => p.name === args.name)
    if (!person) {
      return null
    }

    const updatedPerson = { ...person, phone: args.phone }
    persons = persons.map(p => p.name === args.name ? updatedPerson : p)
    return updatedPerson
  }   
}
```

### **More on queries**
GraphQL can 

1) Combine multiple fields of type Query   

**personCount + allPersons**
  ```gql
  query {
    personCount
    allPersons {
      name
    }
  }
  ```

2) Same query multiple times through giving them alternative names  

**Persons with & without phone numbers**
```gql
query {
  havePhone: allPersons(phone: YES){
    name
  }
  phoneless: allPersons(phone: NO){
    name
  }
}
```

Can be beneficial to **name the queries/mutations** in cases of them having parameters and the different operations resulting from it

### **Learned during part8a exercises**
Array methods refresher
1) **Some**
  * Use to *check* (returns Boolean) if an element exists within an list of objects
  * ```authors.some(author => author.name === authorToFind)```
2) **Filter**
  * Use to *get all* (returns array) the occurrences that match your operand
  * ```filteredBooks.filter((book) => book.author === args.author)```
3) **Find**
  * Use to *get the first* (returns Object) occurrence of your operand 
  * ```const author = authors.find(a => a.name === args.name)```
4) **Reduce**
  * Use to *build upon* a value (returns result: sum/array/*Object*)
  * ```javascript
    const sumReduce = books.reduce(
      (sum, currentBook) => sum + (currentBook.author === root.name)
      , 0 // INITIAL VALUE (use [] for array and {} for object)
    );
    ```
5) **Map**
  * Use to *update* some object in your array
  * ```javascript
    authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
    ```
  * General use can be to *create* a new array derived from the looping array


## **GraphQL and React**
GraphQL queries CAN be executed through HTTP POST requests to the graphql endpoint (axios)  
--> ```http://localhost:4000/graphql```
--> ```{"query": "query { allPersons{ name } }"```

HOWEVER, it is usually recommended to use a **higher-level** library to abstract the communication
1) **Relay** by Facebook
2) **Apollo Client** by Apollo (client-side of the Apollo Server used in the last section)
  * Apollo Client is the one to be focused on as it is the most popular

### **Apollo Client**
Note: Course notes state that the Apollo Client does **not** work well with React 18 (21th April 2022) so we downgrade ```react``` and ```react-dom``` packages by editing ```package.json``` and running ```npm install```

Install Apollo Client packages
```javascript
npm install @apollo/client graphql
```

A client is instantiated with a **cache** and **link** (imported from '@apollo/client')
```javascript
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000',
  })
})
```

A query is executed through a gql string
```javascript
const query = gql`
query {
  allPersons {
    name,
    phone,
    address {
      street,
      city
    }
    id
  }
}
`
```

The client can be made **accessible to all components** by wrapping ```<App />``` with ```ApolloProvider``` and sending the client object to ```ApolloProvider```
```javascript
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
```

### **Making Queries**
```useQuery()``` is the hook function that is the dominant method to make queries 
```javascript
import { gql, useQuery } from '@apollo/client'

const ALL_PERSONS = gql`
query {
  allPersons {
    name
    phone
    id
  }
}
`

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      {result.data.allPersons.map(p => p.name).join(', ')}
    </div>
  )
}
```
* useQuery will return a result with [multiple fields](https://www.apollographql.com/docs/react/api/react/hooks/#result)
* ```loading```: Boolean to check if the query has received a response yet
* ```data```: Contains the result of the query

### **Named queries and variables**
GraphQL variables can be set through the ```variables``` object when calling ```useQuery``` 
```javascript
const [nameToSearch, setNameToSearch] = useState(null)
const result = useQuery(FIND_PERSON, {
  variables: { nameToSearch },
  skip: !nameToSearch,
})
```
* Query is **conditionally** executed is with the use of the ```skip``` option  

</br>

The Query string (FIND_PERSON)
```javascript
const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`
```
* Notice that the query is **named** now (```findPersonByName```) and is given a **parameter** (```$nameToSearch```)


#### **useLazyQuery**
* Apollo hook that will define a query and execute it when the user performs some sort of action
* So the component will not *render* with that query executed, and it will be on a button click, submission, etc.

Code function after rework above
--
* State ```nameToSearch``` is initialized to ```null```
* Query ```FIND_PERSON``` is defined with options
  * ```variables```
  * ```skip```
    * Will **not** execute the query when ```nameToSearch=null```
* On component's **first render** (since ```nameToSearch=null```), a list of person names from props is shown with a button
  * onClick: Set the state ```nameToSearch``` to its corresponding person --> **RE-RENDER**
* *Now* an individual ```<Person />``` component is rendered with the Person's details and a button
  * onClick: Set the state ```nameToSearch``` to null --> **RE-RENDER**
  * Conditional render for ```<Person />```
    * ```javascript
      if (nameToSearch && result.data) {
        return (
          <Person
            person={result.data.findPerson}
            onClose={() => setNameToSearch(null)}
          />
        )
      }
      ```

### **Cache**
