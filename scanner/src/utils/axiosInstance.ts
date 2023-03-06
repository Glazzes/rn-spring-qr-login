// @ts-nocheck
import axios, {AxiosError} from 'axios';
import {TokenResponse} from './types';
import {API_URL as host} from '@env';
import {mmkv} from './mmkv';
import {apiTokenUrl} from './urls';
import {
  setAuthenticationTokens,
  setIsAuthenticated,
} from '../store/slices/authSlice';

const axiosInstance = axios.create({
  baseURL: host,
});

axiosInstance.interceptors.request.use(config => {
  const tokensString = mmkv.getString('tokens');
  if (tokensString !== undefined) {
    const tokens: TokenResponse = JSON.parse(tokensString);
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    error.config.retry = true;

    if (
      (error.response.status === 401 || error.response.status === 403) &&
      error.config.retry
    ) {
      try {
        error.config.retry = false;
        const tokens: TokenResponse = JSON.parse(mmkv.getString('tokens')!!);
        const {data} = await axios.post<TokenResponse>(
          `${host}${apiTokenUrl}`,
          undefined,
          {
            params: {
              token: tokens.refreshToken,
            },
          },
        );

        if (data) {
          setAuthenticationTokens(data);
          mmkv.set('tokens', JSON.stringify(data));
        }

        return axiosInstance(error.config);
      } catch (e) {
        const response = (e as AxiosError).response;
        if (response?.status === 403) {
          setIsAuthenticated(false);
        }

        return Promise.reject(e);
      } finally {
        error.config.retry = true;
      }
    }

    return Promise.reject(error);
  },
);

export {axiosInstance};
