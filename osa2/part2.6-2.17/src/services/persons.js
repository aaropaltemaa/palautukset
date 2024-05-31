import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: '10000',
    name: 'Fake person',
    number: '328428254285725023052305237052353205832523953280932'
  }
  return request.then(response => response.data.concat(nonExisting))
}
const create = (newObject) => {
  return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
  }

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, remove }


