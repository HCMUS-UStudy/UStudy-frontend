import axios, { AxiosError } from "axios";
import { CustomError } from "../types/type";
import { handleRefreshToken } from "@/app/lib/services/auth";
import {
  getTokensFromCookies,
  getUserDataFromCookies,
  handleLogoutCookies,
  setTokensAndUserDataCookies,
} from "./action";
import { redirect } from "next/navigation";

const requestUrl = ["/auth/login"];

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const decodeToken = (token: string) => {
  return JSON.parse(atob(token.split(".")[1]));
};

export const handleExpiredAccessToken = async (
  refreshToken: string | null,
): Promise<string | null> => {
  try {
    const response = await handleRefreshToken(refreshToken);
    if (!response?.data) {
      return null;
    }
    const newAT = response.data.access_token;
    const newRT = response.data.refresh_token;
    if (newAT && newRT) {
      setTokensAndUserDataCookies(newAT, newRT);
      return newAT;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

axiosInstance.interceptors.request.use(
  async function (request) {
    if (!requestUrl.includes(request.url ?? "")) {
      const { accessToken, refreshToken } = await getTokensFromCookies();
      let _accessToken = accessToken;
      if (_accessToken) {
        const parsedData = decodeToken(_accessToken);
        const expiredTime = new Date(parsedData.exp * 1000);
        const currentTime = new Date();
        const adjust = new Date(currentTime.getTime() + 1000);
        if (adjust > expiredTime) {
          _accessToken = await handleExpiredAccessToken(refreshToken);
          if (!_accessToken) {
            // handleLogout();
            const defaultRoute = (await getUserDataFromCookies())?.role
              .defaultRoute;
            handleLogoutCookies();
            // window.location.href = "/login";
            switch (defaultRoute) {
              case "ADMIN":
                redirect("/admin/login");
              default:
                redirect("/login");
            }
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
      //handleLogout();
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
