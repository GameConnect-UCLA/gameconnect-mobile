import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeed } from "../../post/api/post.api";

export const useFetchFeed = () => {
    return useInfiniteQuery({
        queryKey: ["fetch-feed"],
        queryFn: ({ pageParam = 0 }) => fetchFeed(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.flat().length : undefined;
        },
    })
}