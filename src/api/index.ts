import axios from 'axios'

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})
instance.interceptors.request.use((config) => {
  const newConfig = window.structuredClone(config)
  newConfig.baseUrl = localStorage.getItem('ext-ctl')
  newConfig.headers = {
    ...newConfig.headers,
    Authorization: `Bearer ${localStorage.getItem('ctl-secret')}`,
  }
  return newConfig
})
export default instance
