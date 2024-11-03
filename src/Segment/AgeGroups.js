import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
// import * from '../../public/data/Customer_Segmentation_Data_1000.csv'

const AgeGroups = (props) => {
  const [data, setData] = useState({});
  const svgRef = useRef();

    useEffect(() => {
      readData();
    }, [])

    useEffect(() => {
      if (data?.length > 0) {
        drawChart();
      }
    }, [data])

    const readData = async () => {
      const path = '/data/Customer_Segmentation_Data_1000.csv'
      const response = await fetch(path);
      const text = await response.text();
      const parsedData = d3.csvParse(text);
      

      const dataWithAge = parsedData.map(item => ({
        ...item,
        age: calculateAge(item["Date of Birth"])
      }));
      
      const grouped = groupByAge(dataWithAge);
      console.log('grouped', grouped)
      setData(grouped);
    }

    const calculateAge = (dob) => {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const groupByAge = (data) => {
      const ageGroups = {
        "less than 16 years": 0,
        "16-25 years": 0,
        "26-40 years": 0,
        "40-60 years": 0,
        "60+ years": 0
      };
  
      data.forEach(item => {
        const age = item.age;
        if (age < 16) {
          ageGroups["less than 16 years"]++;
        } else if (age >= 16 && age <= 25) {
          ageGroups["16-25 years"]++;
        } else if (age >= 26 && age <= 40) {
          ageGroups["26-40 years"]++;
        } else if (age >= 41 && age <= 60) {
          ageGroups["40-60 years"]++;
        } else {
          ageGroups["60+ years"]++
        }
      });

      const groups = Object.keys(ageGroups).map(key=> ({name: key, value: ageGroups[key]}))
  
      return groups;
    };

    const drawChart = () => {
      const width = 928;
      const height = Math.min(width, 500);

      console.log('data', data)

      // Create the color scale.
      // debugger
      const color = d3.scaleOrdinal()
          .domain(data.map(d => d.name))
          .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

      // Create the pie layout and arc generator.
      const pie = d3.pie()
          .sort(null)
          .value(d => d.value);

      const arc = d3.arc()
          .innerRadius(0)
          .outerRadius(Math.min(width, height) / 2 - 1);

      const labelRadius = arc.outerRadius()() * 0.8;

      // A separate arc generator for labels.
      const arcLabel = d3.arc()
          .innerRadius(labelRadius)
          .outerRadius(labelRadius);

      const arcs = pie(data);

      // Create the SVG container.
      // const svg = d3.create("svg")
      const svg = d3.select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

      // Add a sector path for each value.
      svg.append("g")
          .attr("stroke", "white")
        .selectAll()
        .data(arcs)
        .join("path")
          .attr("fill", d => color(d.data.name))
          .attr("d", arc)
        .append("title")
          .text(d => `${d.data.name}: ${d.data.value}`);

      // Create a new arc generator to place a label close to the edge.
      // The label shows the value if there is enough room.
      svg.append("g")
          .attr("text-anchor", "middle")
        .selectAll()
        .data(arcs)
        .join("text")
          .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
          .call(text => text.append("tspan")
              .attr("y", "-0.4em")
              .attr("font-weight", "bold")
              .text(d => d.data.name))
          .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
              .attr("x", 0)
              .attr("y", "0.7em")
              .attr("fill-opacity", 0.7)
              .text(d => d.data.value));

      return svg.node();
    }

    return <svg ref={svgRef}></svg>;
}
export default AgeGroups;