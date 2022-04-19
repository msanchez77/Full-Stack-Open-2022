import axios from "axios"
const baseURL = '/api/notes'

// Returning the "then" method on the request variable instead
// of returning the promise for the Component to call "then"

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

const update = async (id, newObject) => {
  const request = axios.put(`${baseURL}/${id}`, newObject)
  const response = await request
	return response.data
}

const exportObj = {
	getAll,
	create,
	update
}

export default exportObj;