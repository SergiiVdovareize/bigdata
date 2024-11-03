import React, { useEffect, useRef, useState } from 'react'
import dataDrawer from '../utils/dataDrawer';
import dataResolver from '../utils/dataResolver';
import dataGrouper from '../utils/dataGrouper';

const AgeGroups = () => {
  const [data, setData] = useState(null);
  const svgRef = useRef();

    useEffect(() => {
      readData();
    }, [])

    useEffect(() => {
      if (data?.length > 0) {
        dataDrawer.drawPie(data, svgRef.current)
      }
    }, [data])

    const readData = async () => {
      const parsedData = await dataResolver.read()
      const grouped = dataGrouper.groupByAge(parsedData)
      const normalized = dataResolver.normalize(grouped)
      setData(normalized);
    }

    return <svg ref={svgRef}></svg>;
}
export default AgeGroups;