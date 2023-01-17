import {
  ScatterPlotDatum,
  ScatterPlotRawSerie,
  ScatterPlot as NivoScatterPlot,
} from "@nivo/scatterplot";
import * as React from "react";
import { taxiScatterData } from "../../../mocks/taxiScatterData";
import { WithAutoResize } from "../../components/AutoResizer/AutoResizer";
import { darkTheme } from "../themes";

type Data = { resultCount: number; labels: string[]; values: any[][] };

type Dots = ScatterPlotDatum & { dotSize: number };

/**
 * Builds on Nivo's ScatterPlot with some basic assumptions about how
 * queried data maps into the domain:
 *   - First column maps to X axis
 *   - Second columnn maps to Y axis
 *   - Third column maps to circle color
 *   - Fourth column maps to circle size
 */
const BaseScatterPlot = (props: {
  data?: Data;
  width: number;
  height: number;
}) => {
  const dataCollection: Record<string, ScatterPlotRawSerie<Dots>> = {};

  // Fall back to 'taxiScatterData' for testing purposes
  const srcData = props.data || taxiScatterData;
  srcData.values.forEach((row, i) => {
    const group = row[2] || "Base";
    if (!dataCollection[group]) {
      dataCollection[group] = {
        id: group,
        data: [],
      };
    }
    dataCollection[group].data.push({
      x: row[0],
      y: row[1],
      // Prevent the circles from getting too big just for simplicity
      dotSize: Math.min((row[3] || 1) * 5, 35),
    });
  });

  let data = Object.values(dataCollection);

  return (
    <NivoScatterPlot<Dots>
      data={data}
      theme={darkTheme}
      margin={{ top: 60, right: 60, bottom: 70, left: 90 }}
      xScale={{ type: "linear", min: "auto", max: "auto" }}
      yScale={{ type: "linear", min: 0, max: "auto" }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 15,
        legend: srcData.labels[0],
        legendPosition: "middle",
        legendOffset: 40,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 15,
        tickRotation: 0,
        legend: srcData.labels[1],
        legendPosition: "middle",
        legendOffset: -60,
      }}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 130,
          translateY: 0,
          itemWidth: 100,
          itemHeight: 12,
          itemsSpacing: 5,
          itemDirection: "left-to-right",
          symbolSize: 12,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      width={props.width}
      height={props.height}
      nodeSize={(d) => d.data.dotSize || 10}
    />
  );
};

// This should be the primary way ScatterPlot is consumed
export const ScatterPlot = WithAutoResize(BaseScatterPlot);
