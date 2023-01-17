import * as React from "react";
import * as duckdb from "@duckdb/duckdb-wasm";

type QueryState =
  | {
      state: "loading";
    }
  | {
      state: "idle";
    }
  | {
      state: "error";
      error: Error;
    };

export type SqlResults = {
  /**
   * The number of results (rows) returned
   */
  resultCount: number;
  /**
   * The labels for each column of data
   */
  labels: string[];
  /**
   * Results organized as an array of rows (table format)
   */
  values: any[][];
};

/**
 * Given an AsyncDuckDBConnection, returns a helper function for issuing queries
 * and parsing responses plus tracking of the state of the current query
 */
export const useSqlQuery = (connection?: duckdb.AsyncDuckDBConnection) => {
  const [queryState, setQueryState] = React.useState<QueryState>({
    state: "idle",
  });
  const [lastQueryResults, setLastQueryResults] = React.useState<
    undefined | SqlResults
  >(undefined);

  const runQuery = (sqlQuery: string) => {
    if (!connection) {
      return;
    }
    setLastQueryResults(undefined);
    setQueryState({ state: "loading" });
    connection
      .query(sqlQuery)
      .then((table) => {
        console.log(table.schema);
        const temp: SqlResults = {
          resultCount: table.getChild(0)?.toArray().length,
          labels: [],
          values: [],
        };

        // This is a temporary hack to parse the data into a nicer 'table' format
        // but it doesn't handle all of the data types very well
        table.schema.fields.forEach((field) => {
          temp.labels.push(field.name);
          let vals = table.getChild(field.name)?.toArray() || [];
          if (vals instanceof BigInt64Array) {
            vals.forEach((v: any, i: any) => {
              if (!temp.values[i]) {
                temp.values[i] = [];
              }
              temp.values[i].push(Number(v));
            });
          } else {
            vals.forEach((v: any, i: any) => {
              if (!temp.values[i]) {
                temp.values[i] = [];
              }
              temp.values[i].push(v);
            });
          }
        });

        console.warn(temp);
        setLastQueryResults(temp);
        setQueryState({ state: "idle" });
      })
      .catch((err) => setQueryState({ state: "error", error: err }));
  };

  return {
    runQuery,
    queryState,
    lastQueryResults,
  };
};
