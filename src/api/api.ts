import axios, {InternalAxiosRequestConfig} from 'axios';
import {BASE_URL} from '@env';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {'User-Agent': 'Mozilla/5.0'},
  
});

const apiConfig = {
  baseUrl: BASE_URL,
  // should end with a slash
};
// Ask y

function getUrl(config: InternalAxiosRequestConfig<any>) {
  if (config?.url) return config.url;
  return apiConfig.baseUrl;
}

api.interceptors.request.use(
  config => {
    // console.log(
    //   `%c ${config.method?.toUpperCase()} - ${getUrl(config)}:`,
    //   'color: #0086b3; font-weight: bold',
    //   config,
    // );
    return config;
  },
  error => Promise.reject(error),
);
// Intercept all responses

api.interceptors.response.use(
  async response => {
    console.log(
      `%c ${response?.status} - ${getUrl(response.config)}:`,
      'color: #008000; font-weight: bold',
      response,
    );
    return response;
  },
  error => {
    console.log(
      `%c ${error.response?.status} - ${getUrl(error.response?.config)}:`,
      'color: #a71d5d; font-weight: bold',
      error.response,
    );
    return Promise.reject(error);
  },
);
