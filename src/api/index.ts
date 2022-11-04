import axios from 'axios'

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})
instance.interceptors.request.use((config) => {
  const newConfig = config
  newConfig.baseURL = `http://${sessionStorage.getItem('ext-ctl')}` ?? ''
  newConfig.headers = {
    ...newConfig.headers,
    Authorization: `Bearer ${sessionStorage.getItem('ctl-secret')}`,
  }
  return newConfig
})
export default instance
