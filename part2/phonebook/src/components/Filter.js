import React from 'react'

const Filter = ({search, setSearch, persons, setPersons}) => {

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
    <div>filter shown with <input
                                value={search}
                                onChange={handleSearch}
                            />
    </div>
	)  
}

export default Filter