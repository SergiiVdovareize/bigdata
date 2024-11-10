import React, { useEffect, useRef, useState } from 'react'
import dataResolver from '../../utils/dataResolver';
import ReactECharts from 'echarts-for-react'

const LiveLine = () => {
  const [data, setData] = useState(null);
  const [chartOption, setChartOption] = useState(null);
  
  const cashedData = useRef(null);
  const timeoutId = useRef(null);
  
  const visibleLength = 200;
  const currentIndex = useRef(visibleLength);

    useEffect(() => {
      readData();
    }, [])

    useEffect(() => {
      if (data?.rsrq?.length > 0) {
        const option = {
          title: {
            text: 'RSRQ Live',
            subtext: 'Test data'
          },
          tooltip: {
            trigger: 'axis',
            formatter: ([{name, data}]) => `${name}, ${data}`,
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              interval: 16,
              rotate: 30
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
            max: -5,
            min: -20
          },
          series: [
            {
              name: 'Fake Data',
              type: 'line',
              showSymbol: false,
              data: data.rsrq
            }
          ]
        };

        setChartOption(option)
        if (timeoutId.current) {
          clearTimeout(timeoutId.current)
        }
        
        timeoutId.current = setTimeout(watchData, 1000)
      }
    }, [data?.rsrq])

    const watchData = () => {
      const prevData = {
        rsrq: [...data.rsrq],
        timestamp: [...data.timestamp]
      }

      
      prevData.rsrq.shift()
      prevData.rsrq.push(cashedData.current.rsrq[currentIndex.current])

      prevData.timestamp.shift()
      prevData.timestamp.push(cashedData.current.timestamp[currentIndex.current])

      currentIndex.current = currentIndex.current >= cashedData.current.rsrq.length ? 0 : currentIndex.current + 1
      setData(prevData)
    }

    const readData = async () => {
      const fileName = 'B_2018.01.19_16.06.32.csv';
      const parsedData = await dataResolver.readPedestrians(fileName)
      const normalized = {
        rsrp: [],
        rsrq: [],
        cqi: [],
        timestamp: [],
      }

      parsedData.forEach(line => {
        if (!line.RSRP || !line.RSRQ || !line.Timestamp) {
          return
        }

        normalized.rsrp.push(line.RSRP)
        normalized.rsrq.push(line.RSRQ)
        normalized.cqi.push(line.CQI)

        const dt = line.Timestamp.split('_');
        const formattedDate = dt[1].replaceAll('.', ':')
        normalized.timestamp.push(formattedDate)
      })

      cashedData.current = normalized;

      const visible = {
        rsrq: normalized.rsrq.slice(0, visibleLength),
        timestamp: normalized.timestamp.slice(0, visibleLength)
      }
      // normalized.sli

      setData(visible);
    }

    return chartOption && <ReactECharts option={chartOption} style={{height: '100%'}}/>;
}
export default LiveLine;