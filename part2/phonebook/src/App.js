import { useEffect, useState } from 'react'

import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
			.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter 
				search={search}
				setSearch={setSearch}
				persons={persons}
				setPersons={setPersons}
			/>
      <h3>add a new</h3>
      <PersonForm 
				persons={persons}
				setPersons={setPersons}
				newName={newName}
				setNewName={setNewName}
				newNumber={newNumber}
				setNewNumber={setNewNumber}
        notification={notification}
        setNotification={setNotification}
      />
      <h3>Numbers</h3>
			<Persons
				persons={persons}
				setPersons={setPersons}
			/>
    </div>
  )
}

export default App