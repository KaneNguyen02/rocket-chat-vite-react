import axios  from "axios"; 
import StorageService from "../utils/storage";

export const  API_HOST_URL = import.meta.env.VITE_HOST_SOCKET;
export const  API_BASE_URL = import.meta.env.VITE_BASE_URL;

const token = StorageService.get('token')
const id = StorageService.get('id')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-Auth-Token": token,
    "X-User-Id": id,
  }
});

export default api;