import * as React from "react";
import { createRoot } from "react-dom/client";
import { Shell } from "./pages/shell";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import { NavBarContainer } from "./components/Navbar/Navbar";
import {
  DuckDBConnectionProvider,
  DuckDBPlatform,
  DuckDBProvider,
} from "@duckdb/react-duckdb";

import "../static/fonts/fonts.module.css";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import * as duckdb from "@duckdb/duckdb-wasm";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm";
import duckdb_wasm_coi from "@duckdb/duckdb-wasm/dist/duckdb-coi.wasm";
import { ChakraProvider } from "@chakra-ui/react";

const DUCKDB_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: new URL(
      "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js",
      import.meta.url
    ).toString(),
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker: new URL(
      "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js",
      import.meta.url
    ).toString(),
  },
  coi: {
    mainModule: duckdb_wasm_coi,
    mainWorker: new URL(
      "@duckdb/duckdb-wasm/dist/duckdb-browser-coi.worker.js",
      import.meta.url
    ).toString(),
    pthreadWorker: new URL(
      "@duckdb/duckdb-wasm/dist/duckdb-browser-coi.pthread.worker.js",
      import.meta.url
    ).toString(),
  },
};
const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);

const paths = /(.*)(\/\/docs\/.*|\/)$/;
const pathMatches = (window?.location?.pathname || "").match(paths);
let basename = "/";
if (pathMatches != null && pathMatches.length >= 2) {
  basename = pathMatches[1];
}

const element = document.getElementById("root");
const root = createRoot(element!);
root.render(
  <DuckDBPlatform logger={logger} bundles={DUCKDB_BUNDLES}>
    <DuckDBProvider>
      <DuckDBConnectionProvider>
        <BrowserRouter basename={basename}>
          <ChakraProvider>
            <Routes>
              <Route
                index
                element={
                  <NavBarContainer>
                    <Shell />
                  </NavBarContainer>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </ChakraProvider>
        </BrowserRouter>
      </DuckDBConnectionProvider>
    </DuckDBProvider>
  </DuckDBPlatform>
);
