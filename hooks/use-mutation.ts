import { InternalAxiosRequestConfig, api } from "@/utils/axiosInstance";
import { useState } from "react";

interface UseMutationOptions<TData, TVariables, TError = Error> {
  url: string;
  method: "post" | "put";
  headers?: InternalAxiosRequestConfig;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
}

type UseMutationReturn<TData, TVariables, TError> = [
  (variables: TVariables) => Promise<void>,
  {
    data: TData | null;
    loading: boolean;
    error: TError | null;
  },
];

export function useMutation<TData, TVariables, TError = Error>(
  options: UseMutationOptions<TData, TVariables, TError>,
): UseMutationReturn<TData, TVariables, TError> {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);

  const { onError, onSuccess, url, method, headers } = options;

  const mutate = async (body: TVariables) => {
    setIsLoading(true);
    await api[method](url, body, headers && headers)
      .then((response) => {
        const data = response.data;
        setData(data);
        setIsLoading(false);
        if (onSuccess) {
          onSuccess(data, body);
        }
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
        if (onError) {
          onError(error, body);
        }
        console.error("An error occur in useMutation: ", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return [mutate, { data, loading: isLoading, error }];
}
