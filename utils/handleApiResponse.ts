import { AxiosResponse } from "axios";

export interface ApiResponse<T = any> {
  status: number;
  data: T;
}

export const handleApiResponse = async <T = any>(
  promise: Promise<AxiosResponse<T>>
): Promise<ApiResponse<T>> => {
  try {
    const res = await promise;
    return { status: res.status, data: res.data };
  } catch (err: any) {
    if (err.response) {
      throw new Error(err.response.data?.detail || "API Error");
    } else if (err.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(err.message || "Unexpected error occurred.");
    }
  }
};
