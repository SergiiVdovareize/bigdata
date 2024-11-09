import React, { useEffect, useRef, useState } from 'react'
import dataResolver from '../../utils/dataResolver';
import ReactECharts from 'echarts-for-react'

const TelecomLine = () => {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(null);
  const [chartOption, setChartOption] = useState(null);

    useEffect(() => {
      readData();
    }, [])

    useEffect(() => {

      if (data?.rsrp?.length > 0) {
        const option = {
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
          title: {
            left: 'center',
            text: 'RSRP/RSRQ'
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.timestamp
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 10
            },
            {
              start: 0,
              end: 10
            }
          ],
          series: [
            {
              name: 'RSRP',
              type: 'line',
              symbol: 'none',
              sampling: 'lttb',
              itemStyle: {
                color: 'rgba(193, 8, 8, 1)'
              },
              areaStyle: {
                color: 'rgba(193, 8, 8, 0.2)'
              },
              data: data.rsrp
            },
            {
              name: 'RSRQ',
              type: 'line',
              symbol: 'none',
              sampling: 'lttb',
              itemStyle: {
                color: 'rgba(32, 141, 245, 1)'
              },
              areaStyle: {
                color: 'rgba(32, 141, 245, 0.2)'
              },
              data: data.rsrq
            },
          ]
        };

        setChartOption(option)
      }
    }, [data])

    const readData = async () => {
      const fileName = 'B_2018.02.11_13.30.46.csv';
      const parsedData = await dataResolver.readPedestrians(fileName)
      
      const normalized = {
        rsrp: [],
        rsrq: [],
        timestamp: [],
      }

      parsedData.forEach(line => {
        if (!line.RSRP || !line.RSRQ || !line.Timestamp) {
          return
        }

        normalized.rsrp.push(line.RSRP)
        normalized.rsrq.push(line.RSRQ)

        const dt = line.Timestamp.split('_');
        const formattedDate = `${dt[0]} ${dt[1].replace('.', ':')}`
        normalized.timestamp.push(formattedDate)
      })

      setData(normalized);
    }

    return chartOption && <ReactECharts option={chartOption} style={{height: '700px'}}/>;
}
export default TelecomLine;