import React, { useEffect, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'

const LiveLine = ({params, data, children}) => {
  const {attr, text, color, min, max} = params
  const [chartOption, setChartOption] = useState(null);

  useEffect(() => {
    if (data?.[attr]?.length > 0) {
      const option = {
        grid: {
          left: 50,
          top: 50,
          right: 30,
          bottom: 30
        },
        title: {
          text,
          subtext: 'Test data'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 20,
            rotate: 15
          },
          splitLine: {
            show: true
          },
          data: data.timestamp
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: true
          },
          // max,
          // min
        },
        series: [
          {
            name: attr.toUpperCase(),
            type: 'line',
            color,
            showSymbol: false,
            data: data[attr],
            // areaStyle: {
            //   color,
            //   opacity: 0.1
            // },
          }
        ]
      };

      setChartOption(option)
    }
  }, [data?.[attr]])


  return <>
    {children}
    {chartOption && <ReactECharts option={chartOption} style={{height: '100%'}}/>}
  </>
}

export default LiveLine;