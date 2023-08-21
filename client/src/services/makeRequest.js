import axios from 'axios'

const api = axios.create({
  // baseURL: process.env.REACT_APP_BACKEND_URL,
  baseUrl: 'http://localhost:1337',
  withCredentials: true
})

export async function makeRequest(url, options) {
  return api(url, options)
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data.message ?? 'Error'))
}
