import * as React from "react";
import { Table, Thead, Th, Tbody, Tr, Td } from "@chakra-ui/react";
import { SqlResults } from "../../hooks/useSqlQuery/useSqlQuery";

/**
 * A simple table to show the results of a Sql Query
 */
export const ResultsTable = ({ data }: { data?: SqlResults }) => {
  if (!data) {
    return null;
  }
  return (
    <Table>
      <Thead>
        <Tr>
          {data.labels.map((name, i) => (
            <Th key={i} color="white">
              {name}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.values.map((row, i) => (
          <Tr key={i}>
            {row.map((val, j) => (
              <Td key={j} color="white">
                {val}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
