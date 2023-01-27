import * as React from "react";
import * as duckdb from "@duckdb/duckdb-wasm";
import { DataType } from "apache-arrow";

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
          const child = table.getChild(field.name);
          let vals = child?.toArray() || [];

          // Patched Timestamp type using:
          // https://observablehq.com/@randomfractals/apache-arrow#cell-530
          if (DataType.isTimestamp(child?.type)) {
            const dates = vals;
            vals = [];
            for (let i = 0; i * 2 < dates.length; i++) {
              const date = new Date(
                (dates[i * 2 + 1] * Math.pow(2, 32) + dates[i * 2]) / 1000
              );
              if (!temp.values[i]) {
                temp.values[i] = [];
              }
              temp.values[i].push(date.toISOString());
              vals.push(date);
            }
          } else if (vals instanceof BigInt64Array) {
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
