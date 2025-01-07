import axios, { AxiosError } from "axios";
import { getTokens, handleLogout, setTokens } from "./storage";
import { CustomError } from "../types/type";
import { handleRefreshToken } from "@/app/lib/services/auth";

const requestUrl = ["/auth/user/login", "/auth/admin/login"];

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const decodeToken = (token: string) => {
  return JSON.parse(atob(token.split(".")[1]));
};

const handleExpiredAccessToken = async (refreshToken: string | null) => {
  try {
    const response = await handleRefreshToken(refreshToken);
    const newAT = response.access_token;
    const newRT = response.refresh_token;
    setTokens(newAT, newRT);
    return newAT;
  } catch (error) {
    console.log(error);
  }
};

axiosInstance.interceptors.request.use(
  async function (request) {
    if (!requestUrl.includes(request.url ?? "")) {
      const { accessToken, refreshToken } = getTokens();
      let _accessToken = accessToken;
      if (_accessToken) {
        const parsedData = decodeToken(_accessToken);
        const expiredTime = new Date(parsedData.exp * 1000);
        const currentTime = new Date();
        const adjust = new Date(currentTime.getTime() + 1000);
        if (adjust > expiredTime) {
          _accessToken = await handleExpiredAccessToken(refreshToken);
          if (!_accessToken) {
            handleLogout();
            window.location.href = "/login";
          }
        }
      }
      request.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return request;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  function (error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.log(error.response);
    if (error.response?.status === 403) {
      handleLogout();
      console.log("403 hoặc 401");
      // window.location.href = '/login';
    }
    const customError: CustomError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  },
);

export default axiosInstance;
