/** Throttled navigation hook wrapping expo-router. */
import { useRouter, Href } from "expo-router";
import { useCallback } from "react";

const THROTTLE_MS = 500;
const lastNavigate = { current: 0 };

/** Wrap expo-router with 500ms throttle. @returns { push, back, replace } navigation methods. */
export function useNavigation() {
  const router = useRouter();

  const push = useCallback(
    (href: Href) => {
      const now = Date.now();
      if (now - lastNavigate.current < THROTTLE_MS) return;
      lastNavigate.current = now;
      router.push(href);
    },
    [router],
  );

  const navigate = useCallback(
    (href: Href) => {
      const now = Date.now();
      if (now - lastNavigate.current < THROTTLE_MS) return;
      lastNavigate.current = now;
      router.navigate(href);
    },
    [router],
  );

  return { push, back: router.back, replace: router.replace, navigate };
}
