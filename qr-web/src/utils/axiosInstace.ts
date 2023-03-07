import axios, { AxiosError } from 'axios';

export const axiosInstance = axios.create({
  baseURL: ''
})

axiosInstance.interceptors.request.use(requestConfig => {
  return requestConfig;
})

axiosInstance.interceptors.response.use(
  response => response,
  (e: AxiosError) => {

  }
)
