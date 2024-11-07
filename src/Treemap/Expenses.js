import React, {useEffect, useState } from 'react'
import dataResolver from '../utils/dataResolver';
import ReactECharts from 'echarts-for-react'

const subcategories = {
  equipment_repair: "Ремонт обладнання",
  software_upgrade: "Оновлення програмного забезпечення",
  technical_staff_salary: "Заробітна плата технічного персоналу",
  station_repair: "Ремонт базових станцій",
  site_rental: "Оренда місця для станцій",
  customer_support: "Підтримка клієнтів",
  staff_training: "Навчання персоналу",
  fiber_upgrade: "Оновлення оптоволокна",
  preventive_maintenance: "Профілактичні роботи",
  cable_infrastructure_maintenance: "Догляд за кабельною інфраструктурою",
  spare_parts_purchase: "Закупівля запчастин",
  operational_expenses: "Експлуатаційні витрати",
  salary: "Заробітна плата",
  health_insurance: "Медичне страхування",
  bonuses: "Премії",
  professional_development: "Професійний розвиток"
};

const Expenses = () => {
  const [data, setData] = useState(null);
  const [chartOption, setChartOption] = useState(null);

    useEffect(() => {
      readData();
    }, [])

    useEffect(() => {
      if (!!data) {
        const option = {
          title: {
            text: 'Витрати',
            subtext: 'AI generated data',
            left: 'center'
          },
          tooltip: {
            formatter: function (info) {
              var value = info.value;
              var treePathInfo = info.treePathInfo;
              var treePath = [];
              for (var i = 1; i < treePathInfo.length; i++) {
                treePath.push(treePathInfo[i].name);
              }
              return [
                `<div class="tooltip-title">${info.name}</div>`,
                `Витрати: ${value} грн`
              ].join('');
            }
          },
          series: [
            {
              name: 'Витрати',
              type: 'treemap',
              
              itemStyle: {
                // borderWidth: 1,
                gapWidth: 2
              },
              data: Object.keys(data).map(key => ({
                name: key,
                value: data[key].total,
                colorSaturation: [0.5, 0.6, 0.7],
                
                children: Object.keys(data[key].values).map(subkey => ({
                  
                  name: subcategories[subkey],
                  value: data[key].values[subkey].total
                }))
              }))
            }
          ]
        };

        setChartOption(option)
      }

    }, [data])

    const readData = async () => {
      const dataFile = '/data/expenses-200.csv';
      const parsedData = await dataResolver.read(dataFile)
      const normalized = []
      parsedData.forEach(item => {
        if (!normalized[item.category]) {
          normalized[item.category] = {
            total: 0,
            values: []
          }
        }
        normalized[item.category].total += parseInt(item.price, 10)

        if (!normalized[item.category].values[item.subcategory]) {
          normalized[item.category].values[item.subcategory] = {
            total: 0,
            values: []
          }
        }

        normalized[item.category].values[item.subcategory].total += parseInt(item.price, 10)
      })
      
      setData(normalized);
    }

    return chartOption && <ReactECharts option={chartOption} style={{height: '100%'}}/>;
}
export default Expenses;