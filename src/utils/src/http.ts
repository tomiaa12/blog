import axios, { AxiosRequestConfig } from "axios"

export const orginHost = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://api.kuangyx.cn"

export const baseUrl = orginHost + "/api"

axios.defaults.baseURL = baseUrl

export const http = axios
