import axios, { AxiosInstance, AxiosResponse } from "axios";

// config
import { APIURLS } from "@/services/config";

// ----------------------------------------------------------------------

const api: AxiosInstance = axios.create({ baseURL: APIURLS.liveUrl });


if (typeof window !== "undefined") {
  const jwt = localStorage.getItem("appToken");
  // const jwt ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTNiNWM2NWVmYzEzY2M2NjQ4OGJkYjgiLCJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwibmFtZSI6IiIsInR5cGUiOiJVU0VSIiwiaWF0IjoxNjk4MzkwNTkwLCJleHAiOjE2OTg0MDg1OTB9.QLPhdAzLwqRSWhr5mz67XbxTyu9ygLA1y1MJ879RxmY'
  api.defaults.headers.Authorization = jwt;
  api.defaults.headers['ngrok-skip-browser-warning'] = '69420'
}

// api.interceptors.request.use(
//   (config: any) => config,
//   (error:any) => Promise.reject(error)
// );

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    const status = error.response?.status;
    try {
      if (status === 401) {
        // Check if the status code is 401 (Unauthorized).
        window.location.href = "/";
      } else if (status === 403) {
        // Check if the status code is 403 (Forbidden).
        window.location.href = "/notfound/403";
      } else if (status === 500) {
        // Check if the status code is 500 (Internal Server Error).
        window.location.href = "/notfound/500";
      } else if (status === 504) {
        // Check if the status code is 500 (Internal Server Error).
        window.location.href = "/notfound/504";
      } /* else if (status === 404) {
        debugger;
        if(error.config.url.endsWith('/module/auth/user/exists')) {
        return Promise.reject(error);
        } else {
          // Check if the status code is 404 (page not found).
          window.location.href = "/notfound/404";
        }
      } */ else {
        return Promise.reject(error);
      }
      return Promise.reject(error);
    } catch (errorValue) {
      return Promise.reject(errorValue);
    }
  }
);

export default api;
