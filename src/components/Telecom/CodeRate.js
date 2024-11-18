import React, { useEffect, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'

const CodeRate = ({data}) => {
  const [chartOption, setChartOption] = useState(null);
  const length = data?.rsrq?.length || 0;

  const getSignalLevel = () => {
    const rsrq = data.rsrq[length-1]
    const rsrp = data.rsrp[length-1]
    const cqi = data.cqi[length-1]
    const snr = data.snr[length-1]

    
    // Normalize RSRP (-140 to -50 mapped to 0-100)
    const rsrpNormalized =
      rsrp >= -50
        ? 100
        : rsrp <= -140
        ? 0
        : ((rsrp + 140) / 90) * 100;

  
    // Normalize RSRQ (-20 to 0 mapped to 0-100)
    const rsrqNormalized =
      rsrq >= 0
        ? 100
        : rsrq <= -20
        ? 0
        : ((rsrq + 20) / 20) * 100;
  
    // Normalize SNR (0 to 20 mapped to 0-100)
    const snrNormalized =
      snr >= 20 ? 100 : snr <= 0 ? 0 : (snr / 20) * 100;
  
    // Normalize CQI (1 to 15 mapped to 0-100, optional)
    const cqiNormalized =
      cqi === null
        ? 0
        : cqi >= 15
        ? 100
        : cqi <= 1
        ? 0
        : ((cqi - 1) / 14) * 100;

    
  
    // Calculate the final weighted signal quality score
    const signalQualityScore =
      0.4 * rsrpNormalized +
      0.3 * rsrqNormalized +
      0.2 * snrNormalized +
      0.1 * cqiNormalized;
  
    return Math.round(signalQualityScore * 100) / 100; // Rounded to 2 decimal places
  }

  useEffect(() => {
    if (length <= 0) {
      return;
    }

    const option = {
      title: {
        text: 'Signal Quality',
        left: 'left',
      },
      series: [
        {
          center: ['50%', '75%'],
          radius: '120%',
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
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
            fontSize: 50,
            offsetCenter: [0, '-10%'],
            valueAnimation: true,
            formatter: function (value) {
              return Math.round(value * 100) + '';
            },
            color: 'inherit'
          },
          data: [
            {
              value: getSignalLevel()/100,
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