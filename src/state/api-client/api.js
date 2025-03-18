import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

const get = (url, params = {}, config = {}) => {
  return api.get(url, { params, ...config });
};

const post = (url, data = {}, config = {}) => {
  return api.post(url, data, config);
};

const put = (url, data = {}, config = {}) => {
  return api.put(url, data, config);
};

const del = (url, config = {}) => {
  return api.delete(url, config);
};

export { get, post, put, del };
