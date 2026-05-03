import { api, axios, AxiosError } from "@/utils/axiosInstance";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseQueryOptions {
  url: string;
  params?: any;
}

type UseQueryReturn<TData, TError> = {
  data: TData | null;
  loading: boolean;
  error: AxiosError<TError> | null;
};

export function useQuery<TData, TError = Error>(
  options: UseQueryOptions,
): UseQueryReturn<TData, TError> {
  const { url, params } = options;

  const queryParams = useMemo(() => params, [params]);

  const [state, setState] = useState<{
    isLoading: boolean;
    data: TData | null;
    error: AxiosError<TError> | null;
  }>({
    isLoading: false,
    data: null,
    error: null,
  });

  const makeQuery = useCallback(async () => {
    const cacheKey = api.generateKey({ url, params: queryParams ?? {}, method: "get" });
    const cached = await api.storage.get(cacheKey);
    const hasCachedData = cached?.state === "cached";

    setState((prev) => ({ ...prev, isLoading: !hasCachedData }));

    try {
      const response = await api.get(url, { params: queryParams ?? {} });
      const data = response.data;
      setState({ isLoading: false, data, error: null });
    } catch (err) {
      if (axios.isAxiosError<TError>(err)) {
        setState({ isLoading: false, data: null, error: err });
      } else {
        console.error("An unknown error occur ", err);
      }
    }
  }, [queryParams, url]);

  useEffect(() => {
    makeQuery();
  }, [makeQuery]);

  return { loading: state.isLoading, data: state.data, error: state.error };
}
