import { useState } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  const getNames = () => persons.map(person=>person.name)

  const isDuplicate = (name) => {
    const current_persons = getNames()

    return current_persons.includes(name)
  }

  const formIncomplete = () => {

    if (!newName || !newNumber) {
      let template_error = ''

      if (!newName && !newNumber) {
        template_error += "Name and number are "
      } else if (!newNumber) {
        template_error += "Number is "
      } else {
        template_error += "Name is "
      }

      template_error += "empty"
      alert(template_error)

      return true
    }


  }

  const handlePersonAdd = (event) => {
    event.preventDefault()

    // Check for empty
    if (formIncomplete()) {return}

    if (isDuplicate(newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const addPerson = {
        name: newName,
        number: newNumber
      }
  
      setPersons(persons.concat(addPerson))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleSearch = (event) => {
    // filter
    setSearch(event.target.value)

    const search = event.target.value
    const results = persons.filter((person) => {
      return person.name.toLowerCase().includes(search.toLowerCase())
    })

    // view
    setPersons(results)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch} />
      <h3>add a new</h3>
      <PersonForm 
        onSubmit={handlePersonAdd} 
        nameValue={newName} 
        nameChange={handleNameChange} 
        numValue={newNumber} 
        numChange={handleNumberChange} 
      />
      <h3>Numbers</h3>
      <Persons persons={persons}/>
    </div>
  )
}

export default App