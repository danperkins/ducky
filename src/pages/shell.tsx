import React from "react";
import * as duckdb from "@duckdb/duckdb-wasm";
import * as rd from "@duckdb/react-duckdb";
import {
  Box,
  Progress,
  Alert,
  AlertIcon,
  HStack,
  Button,
} from "@chakra-ui/react";

import { Loader } from "../components/Loader/Loader";
import { useSqlQuery } from "../hooks/useSqlQuery/useSqlQuery";
import { QueryEditor } from "../components/QueryEditor/QueryEditor";
import { ResultsTable } from "../components/ResultsTable/ResultsTable";
import { ScatterPlot } from "../visualizations/ScatterPlot/ScatterPlot";
import { get, set } from "idb-keyval";
import { DuckDBDataProtocol } from "@duckdb/duckdb-wasm";

/**
 * The 'Shell' page shows a SQL input area and displays the results from
 * the command as either a table or a visualizationn
 */
export const Shell = () => {
  const db = rd.useDuckDB();
  const resolveDB = rd.useDuckDBResolver();
  const [tick, setTick] = React.useState(0);
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

  const [dataVizState, setDataVizState] = React.useState<"table" | "scatter">(
    "table"
  );

  React.useEffect(() => {
    const dbval = db.value;
    if (dbval && connection && tick > 0) {
      get("localfiles").then((allHandles: any[]) => {
        if (allHandles) {
          const files = allHandles.map((handle: FileSystemFileHandle) => {
            // handle
            //handle.queryPermissions()

            return Promise.resolve(
              (handle as any).queryPermission
                ? (handle as any).queryPermission()
                : "granted"
            )
              .then((res: any) => {
                if (res === "granted") {
                  return handle;
                } else {
                  return (handle as any)
                    .requestPermission()
                    .then((res: any) => {
                      if (res === "granted") {
                        return handle;
                      }
                      throw Error("NOT AUTHED");
                    });
                }
              })
              .then((h: FileSystemFileHandle) =>
                h
                  .getFile()
                  .then((file) =>
                    dbval.registerFileHandle(
                      h.name.split(".")[0],
                      file,
                      DuckDBDataProtocol.BROWSER_FILEREADER,
                      false
                    )
                  )
                  .then(() => {
                    const splitName = h.name.split(".")[0];
                    const tableName = splitName; // "taktak";
                    const handle = splitName; // "taktak";
                    return runQuery(
                      `CREATE TABLE ${tableName} AS SELECT * FROM read_parquet(['${splitName}']);`
                    )?.then(() => {
                      return (h as any)
                        .queryPermission()
                        .then((res: any) => console.error(res));
                    });
                  })
              );
          });
        }
      });
      return;
    }
  }, [db.value, connection, tick]);

  if (!connection || !db.value) {
    return <Loader />;
  }

  const runTest = async () => {
    //runQuery("SHOW TABLES")?.then(() => {
    (window as any)
      .showOpenFilePicker()
      .then(async (res: any) => {
        debugger;

        return Promise.all([res, get("localfiles")]);
        //  localStorage.setItem("someVal", res);
        // const restored = localStorage.getItem("someVal");
        // console.log(res);
      })
      .then(([res, localfiles]: [FileSystemFileHandle[], any]) => {
        let storedFilesHandles: FileSystemFileHandle[] = localfiles || [];
        res.forEach((file) => {
          storedFilesHandles = storedFilesHandles.reduce<
            FileSystemFileHandle[]
          >((acc, v) => {
            if (v.name === file.name) {
              acc.push(file);
            } else {
              acc.push(v);
            }
            return acc;
          }, []);
          if (!storedFilesHandles.find((x) => x.name === file.name)) {
            storedFilesHandles.push(file);
          }
        });

        return set("localfiles", storedFilesHandles);
      })
      .then((res: any) => {
        debugger;
        console.log(res);
        setTick((curr) => curr + 1);
      });
    //  });
  };

  return (
    <Box
      p={16}
      backgroundColor="#333"
      w="100%"
      h="100%"
      overflow="auto"
      display="flex"
      flexDir="column"
      position="relative"
    >
      {queryState.state === "loading" && (
        <Progress
          isIndeterminate
          position="absolute"
          top={0}
          left={0}
          width="100%"
          colorScheme="yellow"
          size="md"
        />
      )}
      <QueryEditor onSubmitQuery={runQuery} db={db.value} />
      <Button onClick={runTest}>TEST</Button>
      <Button onClick={() => setTick((curr) => curr + 1)}>TICK</Button>
      <input type="file" pattern="/Users/danperkins/keystores"></input>
      <Box mt={8} flex={1} flexDir="column" display="flex">
        {queryState.state === "error" && (
          <Alert mb={8} status="error">
            <AlertIcon />
            {queryState.error.message}
          </Alert>
        )}

        <HStack>
          <Button
            size="sm"
            key="table"
            variant="solid"
            colorScheme="yellow"
            backgroundColor={
              dataVizState === "table" ? "yellow.500" : "yellow.300"
            }
            onClick={() => setDataVizState("table")}
          >
            Table
          </Button>
          <Button
            size="sm"
            key="scatter"
            variant="solid"
            colorScheme="yellow"
            backgroundColor={
              dataVizState === "scatter" ? "yellow.500" : "yellow.300"
            }
            onClick={() => setDataVizState("scatter")}
          >
            Scatter
          </Button>
        </HStack>
        {dataVizState === "table" && <ResultsTable data={lastQueryResults} />}
        {dataVizState === "scatter" && <ScatterPlot data={lastQueryResults} />}
      </Box>
    </Box>
  );
};
