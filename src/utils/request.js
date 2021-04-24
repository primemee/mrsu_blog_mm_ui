import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8081",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});

instance.interceptors.request.use();

instance.interceptors.response.use();

export default instance;
