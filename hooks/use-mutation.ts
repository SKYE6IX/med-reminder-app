import { api, axios, AxiosError, CacheRequestConfig } from "@/utils/axiosInstance";
import { useState } from "react";

interface UseMutationOptions<TData, TVariables, TError = Error> {
  url: string;
  method: "post" | "put";
  config?: CacheRequestConfig;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: AxiosError<TError>, variables: TVariables) => void;
}

type UseMutationReturn<TData, TVariables, TError> = [
  (variables: TVariables) => Promise<void>,
  {
    data: TData | null;
    loading: boolean;
    error: AxiosError<TError> | null;
  },
];

export function useMutation<TData, TVariables, TError = Error>(
  options: UseMutationOptions<TData, TVariables, TError>,
): UseMutationReturn<TData, TVariables, TError> {
  const [state, setState] = useState<{
    isLoading: boolean;
    data: TData | null;
    error: AxiosError<TError> | null;
  }>({
    isLoading: false,
    data: null,
    error: null,
  });

  const { onError, onSuccess, url, method, config } = options;

  const mutate = async (body: TVariables) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await api[method](url, body, config ?? {});
      if (response.data) {
        onSuccess && onSuccess(response.data, body);
        setState({ isLoading: false, data: response.data, error: null });
      }
    } catch (err) {
      if (axios.isAxiosError<TError>(err)) {
        onError && onError(err, body);
        setState({ isLoading: false, data: null, error: err });
      } else {
        console.log("An unknown error occur ", err);
      }
    }
  };

  return [mutate, { data: state.data, loading: state.isLoading, error: state.error }];
}
