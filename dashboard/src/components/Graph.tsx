import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { DataPoint } from "../interfaces";
import moment from "moment";
import { Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const colours = [
  "rgba(9, 127, 155, 0.5)",
  "rgba(232, 106, 214, 0.5)",
  "rgba(189, 248, 3, 0.5)",
  "rgba(3, 210, 23, 0.5)",
  "rgba(202, 15, 242, 0.5)",
];

interface IGraph {
  influxData: DataPoint[];
}

interface IData {
  label: string;
  data: { x: Date; y: string }[];
  borderColor: string;
  backgroundColor: string;
}

const Graph = ({ influxData }: IGraph) => {
  const bulbIps = new Set(influxData.map((data) => data.bulb_ip));

  // Filter data to only include the last 7 days
  const endDate = moment();
  const startDate = moment().subtract(30, "days");
  const filteredData = influxData.filter((data) =>
    moment(data._time).isBetween(startDate, endDate)
  );

  // Create an array of labels, one for each day in the last 7 days
  const labels = Array.from({ length: 30 }, (_, index) =>
    moment(endDate).subtract(index, "days").format("D-MMM")
  ).reverse();

  const data = Array.from(bulbIps).map((bulbIp, index) => {
    const bulbData = filteredData.filter((data) => data.bulb_ip === bulbIp);
    const onOffData = labels.map((label) => {
      const matchingData = bulbData.find(
        (data) => new Date(data._time).getDay() === new Date(label).getDay()
      );

      if (matchingData) {
        // console.log(matchingData._value);
        if (matchingData._value === "ON") console.log(matchingData._value);
        return matchingData._value === "ON" ? 1 : 1;
      } else {
        return 0;
      }
    });

    return {
      label: `Bulb ${bulbIp}`,
      data: onOffData,
      backgroundColor: colours[index],
    };
  });

  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <>
      <Typography variant="h2">Usage of the last 30 days</Typography>
      <Bar
        options={options}
        data={{
          labels,
          datasets: data,
        }}
      />
    </>
  );
};

export default Graph;
