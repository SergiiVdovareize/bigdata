import React, { useEffect } from 'react'
import * as d3 from 'd3'

const BarChart = (props) => {
    useEffect(() => {
      drawChart();
    }, [props.data])

    const drawChart = () => {
      d3.selectAll("svg").remove();

      const data = props.data;

      const svg = d3.select("body").append("svg")
        .attr("width", props.width)
        .attr("height", props.height);


        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => 300 - 10 * d)
            .attr("width", 65)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green");

        svg.selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .text((d) => d)
          .attr("x", (d, i) => i * 70)
          .attr("y", (d, i) => 300 - (10 * d) - 3)
    }

    return <></>
}
export default BarChart;