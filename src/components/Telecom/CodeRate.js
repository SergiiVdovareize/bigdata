import React, { useEffect, useRef, useState } from 'react'
import dataResolver from '../../utils/dataResolver';
import ReactECharts from 'echarts-for-react'

const CodeRate = ({data}) => {
  // const {attr, text, color, min, max} = params
  const [chartOption, setChartOption] = useState(null);
  const length = data?.rsrq?.length || 0;

  const rsrpRanges = [
      { min: -112, max: -103, scoreMin: 0, scoreMax: 24 },    // Poor
      { min: -102, max: -85, scoreMin: 25, scoreMax: 49 },    // Fair
      { min: -84, max: -75, scoreMin: 50, scoreMax: 74 },     // Good
      { min: -74, max: 0, scoreMin: 75, scoreMax: 100 }       // Excellent
  ];

  // Define the ranges for RSRQ (dB)
  const rsrqRanges = [
      { min: -11, max: -10, scoreMin: 0, scoreMax: 24 },      // Poor
      { min: -10, max: -6, scoreMin: 25, scoreMax: 49 },      // Fair
      { min: -5, max: 0, scoreMin: 50, scoreMax: 74 },        // Good
      { min: 1, max: 10, scoreMin: 75, scoreMax: 100 }        // Excellent
  ];

  const getScore = (value, ranges) => {
    for (const range of ranges) {
        if (value >= range.min && value <= range.max) {
            const normalizedValue = (value - range.min) / (range.max - range.min);
            return range.scoreMin + normalizedValue * (range.scoreMax - range.scoreMin);
        }
    }
    // If the value is outside all ranges, return the closest range boundary score
    return value < ranges[0].min ? ranges[0].scoreMin : ranges[ranges.length - 1].scoreMax;
  }

  const getSignal = () => {
    const rsrq = data.rsrq[length-1]
    const rsrp = data.rsrp[length-1]

    const rsrqScore = getScore(rsrq, rsrqRanges);
    const rsrpScore = getScore(rsrp, rsrpRanges);

    const signalQuality = (rsrpScore + rsrqScore) / 2;
    return Math.round(signalQuality); // Round to the nearest integer
  }
  
  useEffect(() => {
    if (length <= 0) {
      return;
    }

    const option = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '75%'],
          radius: '90%',
          min: 0,
          max: 1,
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.25, '#FF6E76'],
                [0.5, '#FDDD60'],
                [0.75, '#58D9F9'],
                [1, '#7CFFB2']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 5
            }
          },
          axisLabel: {
            color: '#464646',
            fontSize: 20,
            distance: -60,
            rotate: 'tangential',
            formatter: function (value) {
              if (value === 0.875) {
                return 'Excellent';
              } else if (value === 0.625) {
                return 'Good';
              } else if (value === 0.375) {
                return 'Fair';
              } else if (value === 0.125) {
                return 'Poor';
              }
              return '';
            }
          },
          title: {
            offsetCenter: [0, '-10%'],
            fontSize: 20
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, '-35%'],
            valueAnimation: true,
            formatter: function (value) {
              return Math.round(value * 100) + '';
            },
            color: 'inherit'
          },
          data: [
            {
              value: getSignal()/100,
              name: 'Signal Quality'
            }
          ]
        }
      ]
    };

    setChartOption(option)
  }, [data?.rsrq])

  return chartOption && <ReactECharts option={chartOption} style={{height: '100%'}}/>;
}

export default CodeRate;