"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function CaloriesChart() {

  const data = [

    {
      day: "Seg",
      calories: 1800
    },

    {
      day: "Ter",
      calories: 2100
    },

    {
      day: "Qua",
      calories: 1900
    }
  ];

  return (

    <LineChart
      width={500}
      height={300}
      data={data}
    >

      <XAxis dataKey="day" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="calories"
      />

    </LineChart>

  );
}