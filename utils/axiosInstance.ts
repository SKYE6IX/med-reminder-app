import axios, { AxiosError } from "axios";
import Constants from "expo-constants";
import { getValidAccessToken } from "./tokenUtils";

const localhost = Constants.expoConfig?.hostUri?.split(":").shift();

const api = axios.create({
  baseURL: `http://${localhost}:8080/`,
});

const MAX_RETRIES = 3;

api.interceptors.request.use(async (config) => {
  const token = await getValidAccessToken();
  if (!token) {
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// Max retry configuration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Only retry on network errors or 5xx server errors
    const shouldRetry =
      !error.response || (error.response.status >= 500 && error.response.status < 600);

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    config._retryCount = config._retryCount ?? 0;

    if (config._retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    config._retryCount += 1;

    return api(config);
  },
);

export { api, axios, AxiosError };
