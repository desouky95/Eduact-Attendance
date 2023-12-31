import axios, {AxiosProgressEvent, InternalAxiosRequestConfig} from 'axios';
import {BASE_URL} from '@env';
import {Store} from 'src/store';
import {logout} from 'src/store/authReducer/authReducer';
import {wipeSetup} from 'src/store/databaseSetupReducer/databaseSetupReducer';

let store: Store;

export const injectStore = (_store: any) => {
  store = _store;
};

console.log('BASE_URL', BASE_URL);
export const api = axios.create({
  baseURL: BASE_URL,
  // headers: {'User-Agent': 'Mozilla/5.0'},
  headers: {
    'accept': 'application/json',
    'content-type': 'application/json',
  },
});

export const apiConfig = {
  baseUrl: BASE_URL,
  // should end with a slash
  onUploadProgress: function (ev: any) {
    // do your thing here
  },
  onDownloadProgress: (event: AxiosProgressEvent) => {
    const total = event.event.target.responseHeaders['content-length']; // total
    const current = event.event.target.response.length;
    let percentCompleted = Math.floor((current / total) * 100);
    return {percentCompleted, total, current};
    // do your thing here
  },
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
    if (store.getState().auth.isLogged) {
      config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);
// Intercept all responses

api.interceptors.response.use(
  async response => {
    // console.log(
    //   `%c ${response?.status} - ${getUrl(response.config)}:`,
    //   'color: #008000; font-weight: bold',
    //   response,
    // );
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      store.dispatch(wipeSetup());
    }
    console.error(error);
    // console.log(
    //   `%c ${error.response?.status} - ${getUrl(error.response?.config)}:`,
    //   'color: #a71d5d; font-weight: bold',
    //   error.response,
    // );
    return Promise.reject(error);
  },
);

export type WithProgressArgs = {
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
};
