import * as React from "react";
import { Box } from "@chakra-ui/react";
import { useSize } from "../../hooks/useSize/useSize";

type ChartRenderer = (attrs: {
  width: number;
  height: number;
}) => React.ReactNode;

/**
 * This component renders an absolutely positioned div inside a
 * relatively positioned div.  The absolute div will scale to the width
 * and height of its parent but because it is removed from the layout
 * flow it can still shrink when needed.
 *
 * The children of this component should be a function that accepts
 * width and height values and returns a ReactNode
 */
export const AutoResizer = (props: { children: ChartRenderer }) => {
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const size = useSize(boxRef);
  return (
    <Box position="relative" height="100%">
      <Box ref={boxRef} position="absolute" height="100%" width="100%">
        {!size
          ? null
          : props.children({
              width: size.width || 500,
              height: size.height || 500,
            })}
      </Box>
    </Box>
  );
};

/**
 * HOC wrapper to make consuming 'AutoResizer' easier
 */
export function WithAutoResize<T>(Component: React.ComponentType<T>) {
  const WrappedComponent: React.ComponentType<Omit<T, "width" | "height">> = (
    props
  ) => (
    <AutoResizer>
      {(attrs) => (
        <Component
          {...(props as T)}
          height={attrs.height}
          width={attrs.width}
        />
      )}
    </AutoResizer>
  );
  return WrappedComponent;
}
