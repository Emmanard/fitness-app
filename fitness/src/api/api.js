import axios from "axios";

const BASE_URL = "https://exercisedb.p.rapidapi.com";

const options = {
  baseURL: BASE_URL,
  headers: {
    "X-RapidAPI-Key": import.meta.env.VITE_API_URL,
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    Accept: "application/json",
  },
  // Add retry configuration
  retry: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
};

// Create axios instance with retry interceptor
const instance = axios.create(options);

// Add response interceptor for retry logic
instance.interceptors.response.use(undefined, async (err) => {
  const { config } = err;
  if (!config || !config.retry) {
    return Promise.reject(err);
  }

  if (err.response?.status !== 429) {
    return Promise.reject(err);
  }

  config.retryCount = config.retryCount || 0;

  if (config.retryCount >= config.retry) {
    return Promise.reject(err);
  }

  config.retryCount += 1;
  const delay = config.retryDelay(config.retryCount);

  // Wait for the specified delay
  await new Promise((resolve) => setTimeout(resolve, delay));

  return instance(config);
});

export default instance;
