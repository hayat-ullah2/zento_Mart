import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";

// Tiny GET hook for admin pages — returns { data, loading, error, refetch }.
// Pass a path string ("/orders") or a falsy value to skip.
export const useFetch = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try {
      const json = await api.get(path);
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
};
