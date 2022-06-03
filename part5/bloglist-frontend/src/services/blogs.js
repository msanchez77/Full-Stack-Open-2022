import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }

  console.log(`Token found! {${token}}`)
  console.log("Adding to blog")
  console.table(newBlog)

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const blogService = {
  getAll,
  create,
  setToken
}
export default blogService