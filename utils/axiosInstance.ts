import axios, { AxiosError, create } from "axios";
import Constants from "expo-constants";
import { getValidAccessToken } from "./tokenUtils";

const PORT = 8080;
const localhost = Constants.expoConfig?.hostUri?.split(":")[0];
const baseURL = __DEV__ ? `http://${localhost}:${PORT}/api/v1/` : process.env.EXPO_PUBLIC_API_URL;

const api = create({
  baseURL,
});

const MAX_RETRIES = 3;

api.interceptors.request.use(async (config) => {
  const isAuthEndpoint =
    config.url?.includes("/auth/refresh") ||
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register") ||
    config.url?.includes("/auth/social") ||
    config.url?.includes("/auth/forget-password") ||
    config.url?.includes("/auth/forget-password/token");

  if (!isAuthEndpoint) {
    const token = await getValidAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }
  }

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
