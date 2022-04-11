import axios from "axios"
const baseURL = 'http://localhost:3001/persons'

const getAll = async () => {
	const request = axios.get(baseURL)
	const response = await request

	return response.data
}

const create = async newObject => {
	const request = axios.post(baseURL, newObject)
	const response = await request
	return response.data
}

const remove = async (name, id, state, setState) => {
	if (window.confirm(`Delete ${name}?`)) {
		const request = axios.delete(`${baseURL}/${id}`, id)
		request.then(_ => setState(state.filter(n => n.id !== id)))
	}	
}

const update = async (newObject) => {
	const request = axios.put(`${baseURL}/${newObject.id}`, newObject)
	const response = await request
	return response.data
}

const getNames = (persons) => persons.map(person=>person.name)

const getPerson = (persons, name) => {
	return persons.filter(p => p.name === name)[0]
}


const exportObj = {
	getAll,
	create,
	remove,
	update,
	getNames,
	getPerson
}

export default exportObj