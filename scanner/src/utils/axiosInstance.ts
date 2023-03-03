import axios from 'axios';
import {TokenResponse} from './types';
import {API_URL as host} from '@env';
import {mmkv} from './mmkv';

const axiosInstance = axios.create({
  baseURL: host,
});

axiosInstance.interceptors.request.use(config => {
  const tokensString = mmkv.getString('tokens');
  if (tokensString !== undefined) {
    const tokens: TokenResponse = JSON.parse(tokensString);

    // @ts-ignore
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    //@ts-ignore
    config.headers['Refresh-Token'] = tokens.refreshToken;
  }

  return config;
});

axiosInstance.interceptors.response.use(response => {
  const accessToken = response.headers.Authorization;
  const refreshToken = response.headers['Refresh-Token'];

  if (accessToken && refreshToken) {
    const tokens: TokenResponse = {accessToken, refreshToken};
    mmkv.set('tokens', JSON.stringify(tokens));
  }
});

export {axiosInstance};
