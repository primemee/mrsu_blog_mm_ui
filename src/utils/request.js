import axios from "axios";

const instance = axios.create({
  //开发环境
  baseURL: "http://localhost:8081",
  //生产环境
  // baseURL: "http://120.79.14.216",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});

instance.interceptors.request.use();

instance.interceptors.response.use();

export default instance;
