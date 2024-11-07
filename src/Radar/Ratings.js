import React, { useEffect, useRef, useState } from 'react'
import dataResolver from '../utils/dataResolver';
import ReactECharts from 'echarts-for-react'

const Ratings = () => {
  const [data, setData] = useState(null);
  const [chartOption, setChartOption] = useState(null);

    useEffect(() => {
      readData();
    }, [])

    useEffect(() => {
      if (!!data) {
        const option = {
          title: {
            text: 'Customers Satisfaction Level',
            subtext: 'AI generated data',
            left: 'center'
          },
          legend: {
            data: ['Ukraine', 'World'],
            left: 'center',
            bottom: 0
          },
          radar: {
            // shape: 'circle',
            center: ['50%', '60%'],
            
            indicator: [
              { name: 'Ціна', max: 10 },
              { name: 'Швидкість', max: 10 },
              { name: 'Якість', max: 10 },
              { name: 'Підтримка', max: 10 },
              { name: 'Прозорість', max: 10 },
            ]
          },
          series: [
            {
              name: 'Budget vs spending',
              type: 'radar',
              data: [
                {
                  value: data.ukraine,
                  name: 'Ukraine',
                  // areaStyle: {
                  //   color: 'rgba(255, 228, 52, 0.6)'
                  // },
                  // lineStyle: {
                  //   color: 'rgba(135, 133, 0, 1)'
                  // }
                },
                {
                  value: data.world,
                  name: 'World',
                  // areaStyle: {
                  //   color: 'rgba(255, 100, 52, 0.6)'
                  // }
                }
              ]
            }
          ]
        };

        setChartOption(option)
      }

    }, [data])

    const readData = async () => {
      const dataFile = '/data/rating-3000.csv';
      const parsedData = await dataResolver.read(dataFile)
      const split = {
        ukraine: [],
        world: [],
      }
      parsedData.forEach(line => {
        split[line.type].push(line)
      })

      const normalized = {}
      const average = {}
      Object.keys(split).forEach(key => {
        normalized[key] = [0, 0, 0, 0, 0]
        average[key] = []
        split[key].forEach(line => {
          normalized[key][0] += parseInt(line.price, 10)
          normalized[key][1] += parseInt(line.speed, 10)
          normalized[key][2] += parseInt(line.quality, 10)
          normalized[key][3] += parseInt(line.support, 10)
          normalized[key][4] += parseInt(line.clarity, 10)
        })
        average[key][0] = normalized[key][0] / split[key].length
        average[key][1] = normalized[key][1] / split[key].length
        average[key][2] = normalized[key][2] / split[key].length
        average[key][3] = normalized[key][3] / split[key].length
        average[key][4] = normalized[key][4] / split[key].length
      })

      setData(average);
    }

    return chartOption && <ReactECharts option={chartOption} style={{height: '100%'}}/>;
}
export default Ratings;