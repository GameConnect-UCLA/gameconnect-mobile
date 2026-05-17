import { useState, useCallback, useRef } from "react";

interface UseScrollToBottomOptions {
  threshold?: number;
}

export function useScrollToBottom(options: UseScrollToBottomOptions = {}) {
  const { threshold = 150 } = options;
  const scrollViewRef = useRef<any>(null);
  const [showButton, setShowButton] = useState(false);

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 999999, animated: true });
  }, []);

  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number }; contentSize: { height: number }; layoutMeasurement: { height: number } } }) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
      setShowButton(distanceFromBottom > threshold);
    },
    [threshold]
  );

  return {
    scrollViewRef,
    showButton,
    scrollToBottom,
    handleScroll,
  };
}