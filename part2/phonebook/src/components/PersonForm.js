import React from 'react'

import personService from '../services/persons'

const PersonForm = ({
									persons, 
									setPersons, 
									newName, 
									setNewName,
									newNumber,
									setNewNumber,
                  notification,
                  setNotification
								}) => {


  const isDuplicate = (name) => {
    const current_persons = personService.getNames(persons)

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
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
				const person = personService.getPerson(persons, newName)
				const changedPerson = {...person, number:newNumber}

				personService
					.update(changedPerson)
					.then(returnedPerson => {
						setPersons(persons.map(p => p.id !== changedPerson.id ? p : returnedPerson))
					})
          .catch(error => {
            setNotification(
              `Information of ${newName} has already been removed from server`
            )
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
			}
    } else {
      const addPerson = {
        name: newName,
        number: newNumber
      }

			personService
				.create(addPerson)
				.then(returnedPerson => {
					setPersons(persons.concat(returnedPerson))
					setNewName('')
					setNewNumber('')
          setNotification(`Added ${newName}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
				})

    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

	return (
    <form onSubmit={handlePersonAdd}>
        <div>
        name: <input 
                value={newName}
                onChange={handleNameChange}
            />
        </div>
        <div>
        number: <input 
                value={newNumber}
                onChange={handleNumberChange}
            />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
	)
}

export default PersonForm