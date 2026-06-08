/** Throttled navigation hook wrapping expo-router. */
import { useRouter, Href } from "expo-router";
import { useCallback } from "react";

const THROTTLE_MS = 500;
const lastNavigate = { current: 0 };
const lastPushedHref = { current: "" };

/** Wrap expo-router with 500ms throttle and exact duplicate push prevention. @returns { push, back, replace } navigation methods. */
export function useNavigation() {
  const router = useRouter();

  const push = useCallback(
    (href: Href) => {
      const now = Date.now();
      if (now - lastNavigate.current < THROTTLE_MS) return;
      const hrefStr = typeof href === "string" ? href : String(href);
      if (lastPushedHref.current === hrefStr) return;
      lastNavigate.current = now;
      lastPushedHref.current = hrefStr;
      router.push(href);
    },
    [router],
  );

  return { push, back: router.back, replace: router.replace };
}
