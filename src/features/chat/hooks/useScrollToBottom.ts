/** Hook for scroll-to-bottom behavior with threshold detection */
import { useState, useCallback, useRef } from "react";

interface UseScrollToBottomOptions {
  threshold?: number;
}

/** Manage scroll-to-bottom button visibility and scroll actions @param options - Optional threshold override @returns { scrollViewRef, showButton, scrollToBottom, handleScroll, handleContentSizeChange } */
export function useScrollToBottom(options: UseScrollToBottomOptions = {}) {
  const { threshold = 150 } = options;
  const scrollViewRef = useRef<any>(null);
  const [showButton, setShowButton] = useState(false);
  const isAtBottomRef = useRef(true);

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const handleScroll = useCallback(
    (event: {
      nativeEvent: {
        contentOffset: { y: number };
        contentSize: { height: number };
        layoutMeasurement: { height: number };
      };
    }) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const distanceFromBottom =
        contentSize.height - layoutMeasurement.height - contentOffset.y;
      const nearBottom = distanceFromBottom <= threshold;
      setShowButton(!nearBottom);
      isAtBottomRef.current = nearBottom;
    },
    [threshold],
  );

  const handleContentSizeChange = useCallback(() => {
    if (isAtBottomRef.current) {
      scrollToBottom();
    }
  }, [scrollToBottom]);

  return {
    scrollViewRef,
    showButton,
    scrollToBottom,
    handleScroll,
    handleContentSizeChange,
  };
}
