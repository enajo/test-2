import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App";
import FeedbackGraph from "../src/components/FeedbackGraph";
import SummaryReport from "../src/components/SummaryReport";

describe("App Component", () => {
  test("renders the app title and toggle button", () => {
    render(<App />);
    expect(screen.getByText(/Real-Time Feedback System/i)).toBeInTheDocument();
    expect(screen.getByText(/Switch to Live Data/i)).toBeInTheDocument();
  });

  test("toggles between mock and live data", () => {
    render(<App />);
    const toggleButton = screen.getByRole("button", { name: /Switch to Live Data/i });

    // Initial state: mock data
    fireEvent.click(toggleButton);
    expect(screen.getByText(/Currently using: Live Sensor Data/i)).toBeInTheDocument();

    // Toggle back to mock data
    fireEvent.click(toggleButton);
    expect(screen.getByText(/Currently using: Mock Data/i)).toBeInTheDocument();
  });
});

describe("FeedbackGraph Component", () => {
  test("renders the SVG graph container", () => {
    render(<FeedbackGraph useMock={true} />);
    const svgElement = screen.getByRole("img", { hidden: true });
    expect(svgElement).toBeInTheDocument();
  });
});

describe("SummaryReport Component", () => {
  test("displays loading message before fetching data", () => {
    render(<SummaryReport />);
    expect(screen.getByText(/Loading session summary.../i)).toBeInTheDocument();
  });

  test("displays summary data after fetching", async () => {
    const mockSummary = {
      correct_movements: 10,
      incorrect_movements: 2,
      average_muscle_activation: 85,
      recommendations: "Keep consistent movements."
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSummary),
      })
    );

    render(<SummaryReport />);
    expect(await screen.findByText(/Correct Movements: 10/i)).toBeInTheDocument();
    expect(await screen.findByText(/Incorrect Movements: 2/i)).toBeInTheDocument();
    expect(await screen.findByText(/Average Muscle Activation: 85%/i)).toBeInTheDocument();
    expect(await screen.findByText(/Keep consistent movements./i)).toBeInTheDocument();
  });

  test("displays error message on fetch failure", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Failed to fetch")));

    render(<SummaryReport />);
    expect(await screen.findByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });
});
