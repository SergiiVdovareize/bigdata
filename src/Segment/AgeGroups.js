import React, { useEffect, useRef, useState } from 'react'
import dataDrawer from '../utils/dataDrawer';
import dataResolver from '../utils/dataResolver';

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
      const path = '/data/customers.csv'
      const parsedData = await dataResolver.read(path)
      const grouped = dataResolver.groupByAge(parsedData)
      const normalized = dataResolver.normalize(grouped)
      setData(normalized);
    }

    return <svg ref={svgRef}></svg>;
}
export default AgeGroups;