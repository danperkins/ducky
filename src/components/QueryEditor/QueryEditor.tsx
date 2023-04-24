import * as React from "react";
import { Box, Textarea, Button, IconButton } from "@chakra-ui/react";
import { AsyncDuckDB, DuckDBDataProtocol } from "@duckdb/duckdb-wasm";
import { AddFileButton } from "../AddFileButton/AddFileButton";

/**
 * A Simple text input and button that will invoke the `onSubmitQuery`
 * prop with the value of the input
 */
export const QueryEditor = ({
  db,
  onSubmitQuery,
}: {
  onSubmitQuery: (query: string) => void;
  db: AsyncDuckDB;
}) => {
  const [sqlQuery, setSqlQuery] = React.useState<string>("");

  const createTableFromFiles = (tableName: string, files: FileList) => {
    const tempLabel = `temp${Date.now()}`;

    const allFiles: { file: File; label: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)!;
      allFiles.push({ file, label: file.name });
    }

    return Promise.all(
      allFiles.map((fileData) =>
        db.registerFileHandle(
          fileData.label,
          fileData.file,
          DuckDBDataProtocol.BROWSER_FILEREADER,
          true
        )
      )
    )
      .catch((err) => {
        console.warn(err);
      })
      .then(() => {
        const fileList = allFiles
          .map((fileData) => `'${fileData.label}'`)
          .join(", ");
        const query = `CREATE TABLE ${tableName} AS SELECT * FROM read_parquet([${fileList}]);`;
        console.log("Create Table Query", query);
        onSubmitQuery(query);
      });
  };
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
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button colorScheme="yellow" onClick={() => onSubmitQuery(sqlQuery)}>
          RUN
        </Button>

        <AddFileButton
          colorScheme="yellow"
          submitText="Create Table from Parquet File"
          fileInputProps={{
            accept: ".parquet",
          }}
          labelPlaceholder="New Table Name"
          onAddFiles={createTableFromFiles}
        />
      </Box>
    </Box>
  );
};
