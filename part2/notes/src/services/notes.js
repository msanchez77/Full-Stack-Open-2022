import axios from "axios"
const baseURL = 'http://localhost:3001/notes'

const getAll = async () => {
	const request = axios.get(baseURL)
	const response = await request

	return response.data
}

const create = newObject => {
	return axios.post(baseURL, newObject)
}

const update = (id, newObject) => {
	return axios.put(`${baseURL}/${id}`, newObject)
}

export default {
	getAll: getAll,
	create: create,
	update: update
}