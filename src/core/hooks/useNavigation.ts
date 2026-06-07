/** Throttled navigation hook wrapping expo-router. */
import { useRouter, Href } from 'expo-router';
import { useCallback, useRef } from 'react';

const THROTTLE_MS = 500;

/** Wrap expo-router with 500ms throttle to prevent rapid-tap stacking. @returns { push, back, replace } navigation methods. */
export function useNavigation() {
  const router = useRouter();
  const lastNavigate = useRef(0);

  const push = useCallback(
    (href: Href) => {
      const now = Date.now();
      if (now - lastNavigate.current < THROTTLE_MS) return;
      lastNavigate.current = now;
      router.push(href);
    },
    [router],
  );

  return { push, back: router.back, replace: router.replace };
}
