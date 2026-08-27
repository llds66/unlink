import { ofetch } from "ofetch";

export const request = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  onRequest() {},
  onRequestError({ error }) {
    console.error("请求服务错误!", error);
    throw new Error("请求服务错误!");
  },
  onResponseError({ response }) {
    return Promise.reject(response._data);
  },
});

interface APIResponse {
  success: boolean;
  message: string;
  data: {
    appuid: string;
  };
}

/**
 * @route POST /xhs
 * @body url - 链接
 */
export function xhsApi(url: string) {
  return request<APIResponse>("/xhs", {
    method: "POST",
    body: {
      url,
    },
  });
}
