"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const Charts = ({
  data: { salesData },
}: {
  data: { salesData: { month: string; totalSales: number }[] };
}) => {
  /**
   * The YAxis component knows what to display by automatically analyzing the totalSales values
   * from the salesData array passed to the BarChart.
   * It calculates the range (min/max) and generates ticks (the values on the axis) accordingly.
   * The tickFormatter function then simply formats each generated tick value by adding a $ prefix.
   */
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={salesData}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="totalSales"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-stone-900"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
