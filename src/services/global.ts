import { APIURLS } from "./config";
import api from "./utils/axios";

// set token in api and session
export const setToken = async (token: string, userId: string) => {
  sessionStorage.setItem("token", token)
  sessionStorage.setItem("UserId", userId)
  api.defaults.headers.Authorization = token;
  // manual refresh if this line not present
}

export const getApiMethod = async (url: string, obj?: Record<string, any>, options?: Record<string, any>) => {
  try {
    let result = null;
    const fullUrl = APIURLS.liveUrl + url;
    const reqOptions: Record<string, any> = {
      params: obj
    };
    if (options?.signal) {
      reqOptions.signal = options?.signal;
    }
    const response = await api.get(fullUrl, reqOptions);
    if (response.data) {
      result = response.data;
    }
    return result;
  } catch (e: any) {
    return e;
    // dispatch(addAlert({
    //   isOpen: true,
    //   message: e.response.data.message,
    //   type: "error",
    //   severity: "error",
    // }))
  }
};

export const getApiMethodsocket = async (url: string, obj?: Record<string, any>, options?: Record<string, any>) => {
  try {
    let result = null;
    const fullUrl = APIURLS.liveUrl + url;
    const reqOptions: Record<string, any> = {
      params: obj
    };
    if (options?.signal) {
      reqOptions.signal = options?.signal;
    }
    const response = await api.get(url);
    if (response.data) {
      result = response.data;
    }
    return result;
  } catch (e: any) {
    return e;
    // dispatch(addAlert({
    //   isOpen: true,
    //   message: e.response.data.message,
    //   type: "error",
    //   severity: "error",
    // }))
  }
};

export const putApiMethod = async (url: string, data?: any) => {
  try {
    const fullUrl = APIURLS.liveUrl + url;

    const response = await api.put(fullUrl, data
      // , {
      //   paramsSerializer: (params:any) => {
      //     return qs.stringify(params, { encode: false });
      //   },
      // }
    );

    if (response.data) {
      return response.data;
    }
    return null;
  } catch (e: any) {
    return e;
  }
};

export const patchApiMethod = async (url: string, data: any) => {
  try {
    const fullUrl = APIURLS.liveUrl + url;

    const response = await api.patch(fullUrl, data);

    if (response.data) {
      return response.data;
    }
    return null;
  } catch (e: any) {
    return e;
  }
};


export const postApiMethod = async (url: string, data?: any) => {
  try {
    const fullUrl = APIURLS.liveUrl + url;

    const response = await api.post(fullUrl, data);
    if (response.data) {
      return response.data;
    }
    return null;
  } catch (e: any) {
    return e;
  }
};

export const deleteApiMethod = async (url: string, data?: any) => {
  try {
    const fullUrl = APIURLS.liveUrl + url;

    const response = await api.delete(fullUrl, data);
    if (response.data) {
      return response.data;
    }

    return null;
  } catch (e: any) {
    throw e;
  }
};
