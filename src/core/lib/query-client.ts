/** TanStack Query client singleton configuration. */
import { QueryClient } from '@tanstack/react-query';

/** Preconfigured QueryClient with 5min stale time and 30min garbage collection. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      gcTime: 1000 * 60 * 30,   // 30 min (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
