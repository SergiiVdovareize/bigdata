import React, { useEffect, useRef, useState } from 'react'
import dataResolver from '../../utils/dataResolver';
import d3DataDrawer from '../../utils/d3DataDrawer';
import dataGrouper from '../../utils/dataGrouper';
import spendingBuilder from '../../utils/spendingBuilder';

const MonthSpending = () => {
  const [data, setData] = useState(null);
  const svgRef = useRef();

    useEffect(() => {
      readData();
    }, [])

    useEffect(() => {
      if (data?.length > 0) {
        spendingBuilder.draw(data, svgRef.current)
      }
    }, [data])

    const readData = async () => {
      const dataFile = '/data/spending-1000.csv';
      const parsedData = await dataResolver.read(dataFile, false)
      setData(parsedData);
    }

    return <svg ref={svgRef}></svg>;
}
export default MonthSpending;