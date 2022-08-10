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

