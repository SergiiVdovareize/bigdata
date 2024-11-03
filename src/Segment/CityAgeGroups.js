import React, { useEffect, useRef, useState } from 'react'
import dataResolver from '../utils/dataResolver';
import dataDrawer from '../utils/dataDrawer';
import dataGrouper from '../utils/dataGrouper';

const CityAgeGroups = () => {
  const [data, setData] = useState(null);
  const svgRef = useRef();

    useEffect(() => {
      readData();
    }, [])

    useEffect(() => {
      if (data?.length > 0) {
        dataDrawer.drawStackedBar(data, svgRef.current)
      }
    }, [data])

    const readData = async () => {
      const parsedData = await dataResolver.read()
      const grouped = dataGrouper.groupByCityAge(parsedData)
      // console.log('grouped', grouped)
      // const normalized = dataResolver.normalize(grouped)
      setData(grouped);
    }

    return <svg ref={svgRef}></svg>;
}
export default CityAgeGroups;