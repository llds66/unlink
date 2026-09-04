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
    user_id: string | null;
  };
}

const XHS_HOSTS = new Set(["xhslink.cn", "www.xiaohongshu.com", "xiaohongshu.com"]);

/**
 * Extract the link from a Xiaohongshu app share message, which commonly
 * includes a title, markdown link and instructions after the actual URL.
 */
export function extractXhsLink(value: string): string | null {
  const candidates = value.match(/https?:\/\/[^\s\]\[<>"')]+/gi) ?? [];

  for (const candidate of candidates) {
    try {
      const parsed = new URL(candidate);
      if (XHS_HOSTS.has(parsed.hostname.toLowerCase())) {
        return parsed.toString();
      }
    } catch {
      // Continue checking other text fragments that look like URLs.
    }
  }

  return null;
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
