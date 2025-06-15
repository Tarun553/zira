import { useState, useCallback } from "react";
import { toast } from "sonner";

// Define a generic type for the callback function
type FetchCallback<TArgs extends unknown[]> = (...args: TArgs) => Promise<Response>;

interface UseFetchOptions {
  initialLoading?: boolean;
}

const useFetch = <TData = unknown, TArgs extends unknown[] = unknown[]>(
  cb: FetchCallback<TArgs>,
  options?: UseFetchOptions
) => {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(options?.initialLoading ?? false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (...args: TArgs) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(response.statusText || `Request failed with status ${response.status}`);
        }
        throw new Error(errorData?.message || response.statusText || `Request failed with status ${response.status}`);
      }
      const result = await response.json() as TData;
      setData(result);
      return result; // Optionally return data
    } catch (err: unknown) {
      let errorMessage = "An unexpected error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      const errorObject = new Error(errorMessage);
      setError(errorObject);
      toast.error(errorMessage);
      throw errorObject; // Re-throw the error so the caller can handle it
    } finally {
      setLoading(false);
    }
  }, [cb]);

  return { data, loading, error, fetchData, setData };
};

export default useFetch;
