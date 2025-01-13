import React, { useEffect, useState } from "react";
import "../styles/app.css";

const SummaryReport = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch("/summary");
        if (!response.ok) {
          throw new Error("Failed to fetch summary");
        }
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <p>Loading session summary...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div className="summary-report">
      <h2>Session Summary</h2>
      {summary ? (
        <div className="summary-content">
          <p><strong>Correct Movements:</strong> {summary.correct_movements}</p>
          <p><strong>Incorrect Movements:</strong> {summary.incorrect_movements}</p>
          <p><strong>Average Muscle Activation:</strong> {summary.average_muscle_activation}%</p>
          <p><strong>Recommendations:</strong> {summary.recommendations}</p>
        </div>
      ) : (
        <p>No summary data available.</p>
      )}
    </div>
  );
};

export default SummaryReport;
