import axios from "axios";
import { getCookie } from "../../utils/authUtils";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${getCookie("token")}`;
    console.log("Request sent:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const get = (url, params = {}, config = {}) =>
  api.get(url, { params, ...config });
const post = (url, data = {}, config = {}) => api.post(url, data, config);
const put = (url, data = {}, config = {}) => api.put(url, data, config);
const del = (url, config = {}) => api.delete(url, config);

export { get, post, put, del };
