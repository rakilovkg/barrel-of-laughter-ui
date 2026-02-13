import { useState } from "react";

const useRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const resetError = () => setError("");

  const send = async (path = "/", method = "GET", payload = null) => {
    setError(null);
    setIsLoading(true);

    const API_HOST = process.env.API_HOST;

    try {
      const response = await fetch(API_HOST + path, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: payload ? JSON.stringify(payload) : null,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData);
        return {};
      }

      return await response.json();
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, send, resetError };
};

export default useRequest;
