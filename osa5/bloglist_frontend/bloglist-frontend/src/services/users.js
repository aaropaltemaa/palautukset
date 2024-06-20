import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getAllBlogs = async () => {
  const response = await axios.get(baseUrl)
  return response.data.map((user) => user.blogs)
}

export default { getAll, getAllBlogs }
