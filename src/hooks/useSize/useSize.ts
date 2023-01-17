import useResizeObserver from "@react-hook/resize-observer";
import * as React from "react";

/**
 * Helper hook that wraps 'useResizeObserver' to re-render with a new
 * 'size' whenever the 'target' element changes size
 */
export const useSize = (
  target: React.MutableRefObject<HTMLDivElement | null>
) => {
  const [size, setSize] = React.useState<DOMRectReadOnly>();

  React.useLayoutEffect(() => {
    if (!target.current) {
      return;
    }
    setSize(target.current.getBoundingClientRect());
  }, [target.current]);

  // Where the magic happens
  useResizeObserver(target, (entry) => {
    setSize(entry.contentRect);
  });
  return size;
};
