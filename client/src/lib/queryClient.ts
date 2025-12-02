import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    // Suppress console logging for expected 403 errors on notifications
    if (res.status === 403 && res.url.includes('/notifications')) {
      // Don't log this error - it's expected during app initialization
      throw new Error(`${res.status}: ${text}`);
    }
    
    // Try to parse as JSON for better error messages
    try {
      const errorData = JSON.parse(text);
      const errorMsg = errorData.message || errorData.error || text;
      throw new Error(`${res.status}: ${errorMsg}`);
    } catch (e) {
      // If not JSON, throw the raw text
      throw new Error(`${res.status}: ${text}`);
    }
  }
}

function getAuthHeaders(): Record<string, string> {
  // Session-based authentication - no need for Authorization headers
  // Cookies are automatically included with credentials: "include"
  return {};
}

export async function apiRequest(
  url: string,
  method: string = 'GET',
  data?: unknown | undefined,
): Promise<Response> {
  // Validate HTTP method
  const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
  const upperMethod = (method || 'GET').toUpperCase();
  
  if (!validMethods.includes(upperMethod)) {
    throw new Error(`Invalid HTTP method: ${method || 'undefined'}. Must be one of: ${validMethods.join(', ')}`);
  }

  const headers = {
    ...getAuthHeaders(),
    ...(data ? { "Content-Type": "application/json" } : {}),
  };

  // Production: Remove debug logging

  // Ensure fetch is available
  const fetchFn = globalThis.fetch || window.fetch;
  if (!fetchFn) {
    throw new Error('Fetch API is not available');
  }

  const res = await fetchFn(url, {
    method: upperMethod,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  // Production: Remove debug logging
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers = {
      ...getAuthHeaders()
    };

    // Ensure fetch is available
    const fetchFn = globalThis.fetch || window.fetch;
    if (!fetchFn) {
      throw new Error('Fetch API is not available');
    }

    const url = queryKey[0] as string;
    const res = await fetchFn(url, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    // Silently handle 403 errors for notifications endpoint during initialization
    if (res.status === 403 && url.includes('/notifications')) {
      return { notifications: [], totalCount: 0, unreadCount: 0 } as any;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false, // Disable automatic polling by default
      refetchOnWindowFocus: false, // Disable refetch on window focus
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes (reduces unnecessary refetches)
      gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
      retry: 1, // Retry once on failure (was 0)
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      networkMode: 'online', // Only make requests when online (was 'always')
    },
    mutations: {
      retry: 1, // Retry mutations once
      retryDelay: 1000,
    },
  },
});

// Don't clear cache on module load - let staleTime handle freshness
// queryClient.clear();
