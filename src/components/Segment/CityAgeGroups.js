import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import dataResolver from '../../utils/dataResolver';
import dataGrouper from '../../utils/dataGrouper';

const CityAgeGroups = () => {
  const [data, setData] = useState(null);
  const [chartOption, setChartOption] = useState(null);

    useEffect(() => {
      readData();
    }, [])

    useEffect(() => {
      if (!data?.length) {
        return
      }

      const cities = data.map(item => item.name)
      const groups = dataGrouper.ageGroups
      const option = {
        title: {
          text: 'City Age Groups',
          subtext: 'AI generated data',
          left: 'center'
        },
        xAxis: {
          data: cities,
          type: 'category',
          name: 'city',
          axisLabel: {
            interval: 0,
            rotate: 30
          },
        },
        yAxis: {},
        series: groups.map(group => {
          return {
            data: data.map(city => city.values.find(val => val.ageGroupId === group.id)?.value),
            type: 'bar',
            stack: 'a',
          }
        })
      };

      setChartOption(option)
    }, [data])

    const readData = async () => {
      const parsedData = await dataResolver.read()
      const grouped = dataGrouper.groupByCityAge(parsedData)

      const normalized = []
      grouped.forEach(line => {
        const current = normalized.find(item => item.name === line.name)
        if (current) {
          current.values.push(line)
        } else {
          normalized.push({name: line.name, values: [line]})
        }
      })

      normalized.forEach(line => {
        line.total = line.values.reduce((partialSum, item) => partialSum + item.value, 0);
      })

      normalized.sort((a, b) => b.total - a.total)
      setData(normalized);
    }

    return chartOption && <ReactECharts option={chartOption} style={{height: '100%'}}/>;
}
export default CityAgeGroups;