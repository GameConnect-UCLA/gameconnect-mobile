import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeed } from "../../post/api/post.api";
import type { Post } from "@/src/core/types/post.types";

export const useFetchFeed = () => {
    return useInfiniteQuery({
        queryKey: ["fetch-feed"],
        queryFn: ({ pageParam = 0 }) => fetchFeed(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.flat().length : undefined;
        },
        staleTime: 30000,
        select: (data) => {
            const seen = new Set<string>();
            const dedupedPages = data.pages.map((page) =>
                page.filter((post: Post) => {
                    if (seen.has(post.id)) return false;
                    seen.add(post.id);
                    return true;
                }),
            );
            return { ...data, pages: dedupedPages };
        },
    })
}