import { postApiMethod } from "@/services/global";
export const postAPI = async (url: any, data: any) => {
    const res: any = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      return { status: true }
    } else {
      return { error: res.response.data.message};
    }
  };