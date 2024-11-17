import React, { useEffect, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { defaultCarriers, defaultMIMOLayers, defaultOverhead, modulationMap, OFDMSymbolsPerSubframe, resourceBlocksMap } from '../../constants/constants';

const Throughput = ({data, bandwidth, mimo}) => {
  const [chartOption, setChartOption] = useState(null);
  const [throughput, setThroughput] = useState(null);

  let max = 100
  if (bandwidth > 15) {
    if (mimo >= 8) {
      max = 1000
    } else {
      max = 500
    }
  } else if (bandwidth > 10) {
    if (mimo >= 8) {
      max = 500
    } else if (mimo >= 4) {
      max = 300
    }
  } else if (bandwidth > 5) {
    if (mimo >= 8) {
      max = 200
    }
  }

  useEffect(() => {
    if (!data?.cqi) {
      return
    }

    const params = {
      cqi: data.cqi[data.cqi.length-1],              // CQI value
    };

    const thr = calculateLTEThroughput(params);
    setThroughput(thr);
  }, [data?.cqi?.[data?.cqi?.length-1], bandwidth, mimo])

  useEffect(() => {
    const option = {
      series: [
        {
          radius: "120%", // Reduced size of the gauge
          center: ["50%", "66%"], // Center the gauge
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max,
          splitNumber: 5,
          itemStyle: {
            color: '#58D9F9',
            shadowColor: 'rgba(0,138,255,0.45)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          progress: {
            show: true,
            roundCap: true,
            width: 18
          },
          pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            length: '75%',
            width: 16,
            offsetCenter: [0, '5%']
          },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 18
            }
          },
          axisTick: {
            splitNumber: 2,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            length: 12,
            lineStyle: {
              width: 3,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 30,
            color: '#999',
            fontSize: 20
          },
          title: {
            show: false
          },
          detail: {
            backgroundColor: '#fff',
            borderColor: '#999',
            borderWidth: 2,
            width: '110%',
            lineHeight: 50,
            height: 40,
            borderRadius: 3,
            offsetCenter: [0, '35%'],
            valueAnimation: true,
            formatter: function (value) {
              return '{value|' + value.toFixed(1) + '}{unit|mbps}';
            },
            rich: {
              value: {
                fontSize: 40,
                fontWeight: 'bolder',
                color: '#777'
              },
              unit: {
                fontSize: 20,
                color: '#999',
                padding: [0, 0, -10, 10]
              }
            }
          },
          data: [
            {
              value: throughput || 0,
              name: 'Throughput'
            }
          ]
        }
      ]
    };

    setChartOption(option)
  }, [throughput])


  const getParamsFromCQI = (cqi) => modulationMap[cqi] || { modulation: "N/A", modulationOrder: 0, codeRate: 0 };

    // Calculate Throughput per RB (bps)
    const calculateThroughputPerRB = (modulationOrder, codeRate) =>
      modulationOrder * codeRate * 12 * OFDMSymbolsPerSubframe;

    // Calculate Total Throughput for a single carrier
    const calculateTotalThroughput = (throughputPerRB, numRBs) =>
      throughputPerRB * numRBs * 1000;

    // Adjust for Overhead
    const adjustThroughputForOverhead = (totalThroughput, overhead = defaultOverhead) =>
      totalThroughput * (1 - overhead);

    // Convert bps to Mbps
    const convertToMbps = (throughput) => throughput / 1e6;

    // Apply MIMO Layers
    const applyMIMOLayers = (throughput, mimoLayers = defaultMIMOLayers) =>
      throughput * mimoLayers;

    // Apply Carrier Aggregation
    const applyCarrierAggregation = (throughput, carriers = defaultCarriers) =>
      throughput * carriers;

    
    // Full LTE Throughput Calculation
    const calculateLTEThroughput = ({
      cqi,
      overhead = defaultOverhead,
      carriers = defaultCarriers,
    }) => {

      // Step 1: Get the number of Resource Blocks (RBs) for the given bandwidth
      const numRBs = resourceBlocksMap[bandwidth]
      if (numRBs === 0) throw new Error("Invalid bandwidth. Choose from 1.4, 3, 5, 10, 15, 20 MHz.");

      // Step 2: Get Modulation Order and Code Rate from CQI
      const { modulation, modulationOrder, codeRate } = getParamsFromCQI(cqi);
      if (modulationOrder === 0) throw new Error("Invalid CQI. Choose a value between 1 and 15.");

      // Step 3: Calculate Throughput per RB
      const throughputPerRB = calculateThroughputPerRB(modulationOrder, codeRate);

      // Step 4: Calculate Total Throughput for a single carrier
      const totalThroughput = calculateTotalThroughput(throughputPerRB, numRBs);

      // Step 5: Adjust for Overhead
      let adjustedThroughput = adjustThroughputForOverhead(totalThroughput, overhead);

      // Step 6: Apply MIMO Layers
      adjustedThroughput = applyMIMOLayers(adjustedThroughput, mimo);

      // Step 7: Apply Carrier Aggregation
      adjustedThroughput = applyCarrierAggregation(adjustedThroughput, carriers);

      // Step 8: Convert to Mbps
      return  convertToMbps(adjustedThroughput).toFixed(2);
    };



  return chartOption && <ReactECharts option={chartOption} style={{height: '100%'}}/>;
}

export default Throughput;