import React from "react";
import * as duckdb from "@duckdb/duckdb-wasm";
import * as rd from "@duckdb/react-duckdb";
import {
  Box,
  Progress,
  Alert,
  AlertIcon,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";

import { Loader } from "../components/Loader/Loader";
import { useSqlQuery } from "../hooks/useSqlQuery/useSqlQuery";
import { QueryEditor } from "../components/QueryEditor/QueryEditor";
import { ResultsTable } from "../components/ResultsTable/ResultsTable";
import { ScatterPlot } from "../visualizations/ScatterPlot/ScatterPlot";

/**
 * The 'Shell' page shows a SQL input area and displays the results from
 * the command as either a table or a visualizationn
 */
export const Shell = () => {
  const db = rd.useDuckDB();
  const resolveDB = rd.useDuckDBResolver();
  const [connection, setConnection] = React.useState<
    duckdb.AsyncDuckDBConnection | undefined
  >(undefined);

  const { lastQueryResults, queryState, runQuery } = useSqlQuery(connection);

  // After the database resolves, create a connection that can be
  // used for issuing queries
  React.useEffect(() => {
    if (!db.resolving()) {
      resolveDB()
        .then((d) => d?.connect())
        .then(setConnection);
    }
  }, [db]);

  if (!connection || !db.value) {
    return <Loader />;
  }

  return (
    <Box
      p={16}
      backgroundColor="#333"
      w="100%"
      h="100%"
      overflow="auto"
      display="flex"
      flexDir="column"
    >
      <QueryEditor onSubmitQuery={runQuery} />
      <Box mt={8} flex={1} flexDir="column" display="flex">
        {queryState.state === "loading" && (
          <Progress
            isIndeterminate
            hasStripe
            colorScheme="yellow"
            size="md"
            mb={8}
          />
        )}
        {queryState.state === "error" && (
          <Alert mb={8} status="error">
            <AlertIcon />
            {queryState.error.message}
          </Alert>
        )}

        <Tabs variant="soft-rounded" colorScheme="yellow">
          <TabList>
            <Tab>Table</Tab>
            <Tab>Scatter</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ResultsTable data={lastQueryResults} />
            </TabPanel>
            <TabPanel>
              <ScatterPlot data={lastQueryResults} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};
