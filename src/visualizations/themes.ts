import { Theme } from "@nivo/core";

// Intended to be used on a dark background
export const darkTheme: Theme = {
  axis: {
    ticks: {
      line: {
        stroke: "white",
      },
      text: {
        fill: "white",
      },
    },
    legend: {
      text: {
        fill: "white",
      },
    },
  },
  grid: {
    line: {
      stroke: "white",
    },
  },
  legends: {
    title: {
      text: {
        fill: "white",
      },
    },
    text: {
      fill: "white",
    },
  },
};
