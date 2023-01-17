import * as React from "react";
import { Box, Textarea, Button } from "@chakra-ui/react";

/**
 * A Simple text input and button that will invoke the `onSubmitQuery`
 * prop with the value of the input
 */
export const QueryEditor = (props: {
  onSubmitQuery: (query: string) => void;
}) => {
  const [sqlQuery, setSqlQuery] = React.useState<string>("");
  return (
    <Box>
      <Textarea
        textColor="white"
        colorScheme="yellow"
        value={sqlQuery}
        onChange={(e) => setSqlQuery(e.target.value)}
        placeholder="Type your query here"
        size="sm"
      />
      <Button
        mt={2}
        colorScheme="yellow"
        onClick={() => props.onSubmitQuery(sqlQuery)}
      >
        RUN
      </Button>
    </Box>
  );
};
