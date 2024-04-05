import axios from "axios";

const $axios = axios.create({
  baseURL: "http://localhost:3000",
});

// Add a request interceptor
$axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  let token;
  if (config.url.startsWith("/admin")) {
    token = JSON.parse(localStorage.getItem("auth-admin"));
  } else {
    token = JSON.parse(localStorage.getItem("auth"));
  }
  // If there is a token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default $axios;
