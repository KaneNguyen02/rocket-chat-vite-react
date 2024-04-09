import axios  from "axios"; 

export const  API_BASE_URL = import.meta.env.VITE_BASE_URL;
// const  API_HOST_URL = import.meta.env.VITE_HOST_SOCKET;

const api = axios.create({
  baseURL: API_BASE_URL
});

export default api;