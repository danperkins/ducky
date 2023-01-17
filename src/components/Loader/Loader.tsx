import * as React from "react";
import { Box, Spinner } from "@chakra-ui/react";

/**
 * Centered full screen Loader component
 */
export const Loader = () => (
  <Box
    style={{ backgroundColor: "#333" }}
    p={16}
    w="100%"
    h="100%"
    display="flex"
  >
    <Spinner
      margin="auto"
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="#FFEF00"
      size="xl"
    />
  </Box>
);
