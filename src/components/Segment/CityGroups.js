import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import dataResolver from '../../utils/dataResolver';
import dataGrouper from '../../utils/dataGrouper';

const CityGroups = () => {
  const [data, setData] = useState(null);
  const [chartOption, setChartOption] = useState(null);

  useEffect(() => {
    readData();
  }, [])

  useEffect(() => {
    if (data?.length > 0) {
      
      const option = {
        title: {
          text: 'City Segmentation',
          subtext: 'AI generated data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      setChartOption(option)
    }
  }, [data])

    const readData = async () => {
      const parsedData = await dataResolver.read('/data/customers-5000.csv', false)
      const grouped = dataGrouper.groupByCity(parsedData)
      const normalized = dataResolver.normalize(grouped)
      setData(normalized);
    }

    return chartOption && <ReactECharts option={chartOption} style={{height: '100%'}}/>;
}
export default CityGroups;