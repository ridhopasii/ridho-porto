"use client";

import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { format, parseISO } from "date-fns";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface DataPoint {
  x: string;
  y: number;
}

interface DataProps {
  data: {
    pageviews: DataPoint[];
    sessions: DataPoint[];
  };
  type?: "bar" | "line";
}

const TrafficTrendsChart = ({ data, type = "bar" }: DataProps) => {
  const rawLabels = data?.pageviews?.map((point) => point.x) || [];
  const labels = rawLabels?.map((isoDate) => format(parseISO(isoDate), "MMM"));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Sessions",
        data: data?.sessions?.map((point) => point.y) || [],
        backgroundColor: type === "bar" ? "rgba(255, 255, 184, 0.7)" : "rgba(255, 255, 184, 0.2)",
        borderColor: type === "line" ? "rgba(251, 228, 0, 1)" : "transparent",
        stack: type === "bar" ? "traffic" : undefined,
        borderRadius: type === "bar" ? 4 : undefined,
        tension: 0.4,
        fill: type === "line",
      },
      {
        label: "Page views",
        data: data?.pageviews?.map((point) => point.y) || [],
        backgroundColor: type === "bar" ? "rgba(251, 228, 0, 0.7)" : "rgba(251, 228, 0, 0.1)",
        borderColor: type === "line" ? "rgba(251, 228, 0, 1)" : "transparent",
        stack: type === "bar" ? "traffic" : undefined,
        borderRadius: type === "bar" ? 4 : undefined,
        tension: 0.4,
        fill: type === "line",
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any[]) => {
            const index = tooltipItems[0].dataIndex;
            const isoDate = rawLabels[index];
            return isoDate ? format(parseISO(isoDate), "MMM yyyy") : "";
          },
        },
      },
    },
    scales: {
      x: {
        stacked: type === "bar",
        grid: {
          display: false,
        },
      },
      y: {
        stacked: type === "bar",
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-[350px] w-full md:h-[400px]">
      {type === "bar" ? (
        <Bar data={chartData} options={options as any} />
      ) : (
        <Line data={chartData} options={options as any} />
      )}
    </div>
  );
};

export default TrafficTrendsChart;
