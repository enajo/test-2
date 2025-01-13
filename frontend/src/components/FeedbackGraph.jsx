import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/graph.css";

const FeedbackGraph = ({ useMock }) => {
  const svgRef = useRef();
  const websocketRef = useRef();

  useEffect(() => {
    // Set up the D3 graph
    const svg = d3.select(svgRef.current)
      .attr("width", 800)
      .attr("height", 400);

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-10, 100]).range([height, 0]);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    g.append("g").call(d3.axisLeft(yScale));

    const line = d3.line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d));

    const accLine = g.append("path").attr("class", "line acc-line");
    const emgLine = g.append("path").attr("class", "line emg-line");

    let accData = [];
    let emgData = [];

    // WebSocket for live data
    websocketRef.current = new WebSocket("ws://localhost:8000/ws");

    websocketRef.current.onmessage = (event) => {
      const { acc, emg } = JSON.parse(event.data);
      accData = [...accData, acc[0]].slice(-100); // Keep last 100 points
      emgData = [...emgData, emg[0]].slice(-100);

      accLine.datum(accData).attr("d", line).attr("stroke", "steelblue");
      emgLine.datum(emgData).attr("d", line).attr("stroke", "orange");
    };

    return () => {
      // Cleanup on component unmount
      websocketRef.current.close();
      svg.selectAll("*").remove();
    };
  }, [useMock]); // Reconnect WebSocket on data source change

  return (
    <div className="graph-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default FeedbackGraph;
