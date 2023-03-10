import axios, { AxiosError } from 'axios';
import { setIsAuthenticated } from './authStore';
import { Tokens } from './types';
import { apiTokenUrl } from './urls';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
})

axiosInstance.interceptors.request.use(requestConfig => {
  const tokens = localStorage.getItem('tokens');
  if(tokens) {
    const {accessToken}: Tokens = JSON.parse(tokens)
    requestConfig.headers.Authorization = accessToken
  }

  return requestConfig;
})

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    error.config.retry = true;
    if((status === 401 || status === 403) && error.config.retry) {
      try {
        error.config.retry = false;
        const tokenString = localStorage.getItem('tokens');

        if(!tokenString) {
          return Promise.reject(error)
        }

        const tokens: Tokens = JSON.parse(tokenString);
        const {data} = await axios.post<Tokens>(
          `${host}${apiTokenUrl}`,
          undefined,
          {
            params: {
              token: tokens.refreshToken,
            },
          },
        );

        if (data) {
          localStorage.setItem('tokens', JSON.stringify(data));
        }

        return axiosInstance(error.config);
      } catch (e) {
        const response = (e as AxiosError).response;
        if (response?.status === 403) {
          setIsAuthenticated(false)
        }

        return Promise.reject(error);
      } finally {
        error.config.retry = true;
      }
    }

    return Promise.reject(error);
  }
)
