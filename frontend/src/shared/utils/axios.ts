import axios from 'axios'

const instanceApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 50000
})

export default instanceApi
