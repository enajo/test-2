import React, { useState } from "react";
import FeedbackGraph from "./components/FeedbackGraph";
import SummaryReport from "./components/SummaryReport";
import "./styles/app.css";

const App = () => {
  const [useMock, setUseMock] = useState(true);
  const [dataSource, setDataSource] = useState("Mock Data");

  const toggleDataSource = async () => {
    const newUseMock = !useMock;
    setUseMock(newUseMock);
    setDataSource(newUseMock ? "Mock Data" : "Live Sensor Data");

    try {
      await fetch(`/toggle?mock=${newUseMock}`); // Inform the backend of the data source change
    } catch (error) {
      console.error("Failed to toggle data source:", error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Real-Time Feedback System</h1>
        <button className="toggle-btn" onClick={toggleDataSource}>
          Switch to {useMock ? "Live Data" : "Mock Data"}
        </button>
        <p>Currently using: {dataSource}</p>
      </header>
      <main className="app-main">
        <FeedbackGraph useMock={useMock} />
        <SummaryReport />
      </main>
    </div>
  );
};

export default App;
