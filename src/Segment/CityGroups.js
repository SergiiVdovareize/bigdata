import React, { useEffect, useRef, useState } from 'react'
import dataResolver from '../utils/dataResolver';
import dataDrawer from '../utils/dataDrawer';

const CityGroups = () => {
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
      const grouped = dataResolver.groupByCity(parsedData)
      const normalized = dataResolver.normalize(grouped)
      setData(normalized);
    }

    return <svg ref={svgRef}></svg>;
}
export default CityGroups;