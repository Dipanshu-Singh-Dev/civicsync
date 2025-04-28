import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Visualise() {
  const [categoryData, setCategoryData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [votesData, setVotesData] = useState(null);

  // Mock data - replace with your actual API calls
  useEffect(() => {
    // Category distribution
    setCategoryData({
      labels: [
        "Road",
        "Park",
        "Parking",
        "Library",
        "Infrastructure",
        "Safety",
        "Other"
      ],
      datasets: [
        {
          data: [12, 19, 8, 5, 7, 3, 9],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#8AC24A"
          ]
        }
      ]
    });

    // Status proportion
    setStatusData({
      labels: ["Pending", "In Progress", "Resolved"],
      datasets: [
        {
          data: [25, 10, 15],
          backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0"]
        }
      ]
    });

    // Votes trend (last 7 days)
    setVotesData({
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
      datasets: [
        {
          label: "Upvotes",
          data: [12, 19, 8, 15, 12, 20, 18],
          backgroundColor: "#36A2EB"
        },
        {
          label: "Downvotes",
          data: [2, 5, 3, 7, 4, 6, 5],
          backgroundColor: "#FF6384"
        }
      ]
    });
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Issue Categories</h2>
        {categoryData && <Pie data={categoryData} />}
      </div>

      {/* Status Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Issue Status</h2>
        {statusData && <Pie data={statusData} />}
      </div>

      {/* Votes Trend Chart (full width) */}
      <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
        <h2 className="text-lg font-semibold mb-4">
          Voting Trends (Last 7 Days)
        </h2>
        {votesData && <Bar data={votesData} options={{ responsive: true }} />}
      </div>
    </div>
  );
}

export default Visualise;
