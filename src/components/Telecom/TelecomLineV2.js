import React, { useEffect, useRef, useState } from 'react'
import dataResolver from '../../utils/dataResolver';
import ReactECharts from 'echarts-for-react'

const TelecomLine2 = () => {
  const [data, setData] = useState(null);
  const [chartOption, setChartOption] = useState(null);

    useEffect(() => {
      readData();
    }, [])

    useEffect(() => {

      if (data?.rsrp?.length > 0) {
        const option = {
          title: {
            text: 'RSRQ / RSRP',
            subtext: 'test data',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          legend: {
            data: ['RSRQ', 'RSRP'],
            left: 10
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
          axisPointer: {
            link: [
              {
                xAxisIndex: 'all'
              }
            ]
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              end: 50,
              xAxisIndex: [0, 1]
            },
            {
              type: 'inside',
              realtime: true,
              start: 0,
              end: 20,
              xAxisIndex: [0, 1]
            }
          ],
          grid: [
            {
              left: 60,
              right: 50,
              top: '55%',
              height: '35%'
            },
            {
              left: 60,
              right: 50,
              height: '35%'
            },
            
          ],
          xAxis: [
            {
              type: 'category',
              // boundaryGap: false,
              axisLine: { onZero: true },
              data: data.timestamp,
              position: 'top'
            },
            {
              gridIndex: 1,
              type: 'category',
              // boundaryGap: false,
              axisLine: { onZero: true },
              data: data.timestamp,
            },
            
          ],
          yAxis: [
            {
              name: 'RSRP',
              type: 'value',
              max: -60,
              min: -120
            },
            {
              gridIndex: 1,
              name: 'RSRQ',
              type: 'value',
              position: 'center',
              max: -5,
              min: -25
            },
          ],

          series: [
            {
              name: 'RSRQ',
              type: 'line',
              xAxisIndex: 1,
              yAxisIndex: 1,
              symbol: 'none',
              itemStyle: {
                color: 'rgba(147, 63, 0, 1)'
              },
              data: data.rsrq
            },
            {
              name: 'RSRP',
              type: 'line',
              // xAxisIndex: 1,
              // yAxisIndex: 1,
              symbol: 'none',
              itemStyle: {
                color: 'rgba(193, 8, 8, 1)'
              },
              data: data.rsrp
            },
            // {
            //   name: 'CQI',
            //   type: 'line',
            //   symbol: 'none',
            //   itemStyle: {
            //     color: 'rgba(0, 166, 19, 1)'
            //   },
            //   data: data.cqi
            // },
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
        const formattedDate = `${dt[0]} ${dt[1].replace('.', ':')}`
        normalized.timestamp.push(formattedDate)
      })

      setData(normalized);
    }

    return chartOption && <ReactECharts option={chartOption} style={{height: '100%'}}/>;
}
export default TelecomLine2;