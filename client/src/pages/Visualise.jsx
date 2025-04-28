import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import { getIssues } from "@/services/issue.service";
import { useStore } from "@/store";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function Visualise() {
  const [categoryData, setCategoryData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [votesData, setVotesData] = useState(null);
  const store = useStore();
  const { user } = store;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const response = await getIssues(user.id);
        const issues = response.data;

        // Process category data
        const categoryCounts = issues.reduce((acc, issue) => {
          acc[issue.category] = (acc[issue.category] || 0) + 1;
          return acc;
        }, {});

        setCategoryData({
          labels: Object.keys(categoryCounts),
          datasets: [
            {
              data: Object.values(categoryCounts),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#8AC24A",
                "#FF6B6B",
                "#45B7D1"
              ].slice(0, Object.keys(categoryCounts).length)
            }
          ]
        });

        // Process status data
        const statusCounts = issues.reduce((acc, issue) => {
          acc[issue.status] = (acc[issue.status] || 0) + 1;
          return acc;
        }, {});

        setStatusData({
          labels: Object.keys(statusCounts),
          datasets: [
            {
              data: Object.values(statusCounts),
              backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0"]
            }
          ]
        });

        // Process votes data (last 7 days)
        const today = new Date();
        const last7Days = Array(7)
          .fill()
          .map((_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            return date.toISOString().split("T")[0];
          })
          .reverse();

        const upvotesByDay = last7Days.map(
          (date) =>
            issues.filter(
              (issue) =>
                new Date(issue.createdAt).toISOString().split("T")[0] ===
                  date && issue.upvoted
            ).length
        );

        const downvotesByDay = last7Days.map(
          (date) =>
            issues.filter(
              (issue) =>
                new Date(issue.createdAt).toISOString().split("T")[0] ===
                  date && issue.downvoted
            ).length
        );

        setVotesData({
          labels: last7Days.map((date) =>
            new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            })
          ),
          datasets: [
            {
              label: "Upvotes",
              data: upvotesByDay,
              backgroundColor: "#36A2EB"
            },
            {
              label: "Downvotes",
              data: downvotesByDay,
              backgroundColor: "#FF6384"
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Issue Categories</h2>
        {categoryData ? (
          <Pie data={categoryData} options={{ responsive: true }} />
        ) : (
          <p>No category data available</p>
        )}
      </div>

      {/* Status Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Issue Status</h2>
        {statusData ? (
          <Pie data={statusData} options={{ responsive: true }} />
        ) : (
          <p>No status data available</p>
        )}
      </div>

      {/* Votes Trend Chart (full width) */}
      <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
        <h2 className="text-lg font-semibold mb-4">
          Voting Trends (Last 7 Days)
        </h2>
        {votesData ? (
          <Bar
            data={votesData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Votes by Day"
                }
              },
              scales: {
                x: {
                  stacked: true
                },
                y: {
                  stacked: true,
                  beginAtZero: true
                }
              }
            }}
          />
        ) : (
          <p>No voting data available</p>
        )}
      </div>
    </div>
  );
}

export default Visualise;
