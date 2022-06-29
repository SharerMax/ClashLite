import axios from 'axios'

const secret = '123456789'
const baseUrl = 'http://127.0.0.1:3001'
const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Authorization': `Bearer ${secret}`,
    'Content-Type': 'application/json',
  },
})
export default instance
