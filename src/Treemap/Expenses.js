import React, {useEffect, useState } from 'react'
import dataResolver from '../utils/dataResolver';
import ReactECharts from 'echarts-for-react'

const expenseCategories = {
  // Інфраструктура
  infra: "Інфраструктура",
  infra_base: "Базові станції",
  infra_base_repair: "Ремонт",
  infra_base_repair_equipment: "Ремонт обладнання",
  infra_base_repair_servicing: "Технічне обслуговування",
  infra_base_repair_parts: "Заміна деталей",
  infra_base_rent: "Оренда",
  infra_base_rent_space: "Оренда приміщень",
  infra_base_rent_land: "Оренда землі",
  infra_base_rent_utilities: "Комунальні витрати",
  infra_cable: "Кабельна інфраструктура",
  infra_cable_upgrade: "Оновлення",
  infra_cable_upgrade_fiber: "Оновлення оптоволокна",
  infra_cable_upgrade_replace: "Заміна кабелів",
  infra_cable_upgrade_modern: "Модернізація обладнання",
  infra_cable_maint: "Профілактика",
  infra_cable_maint_check: "Перевірка кабелів",
  infra_cable_maint_preventive: "Профілактичні роботи",
  infra_cable_maint_diagnostics: "Технічна діагностика",
  infra_cable_maint_monitor: "Моніторинг ліній",
  infra_telecom: "Телекомунікаційне обладнання",
  infra_telecom_purchase: "Закупівля",
  infra_telecom_purchase_antenna: "Придбання антен",
  infra_telecom_purchase_servers: "Придбання серверів",
  infra_telecom_purchase_modules: "Придбання модулів",
  infra_telecom_modern: "Модернізація",
  infra_telecom_modern_replace: "Заміна старих пристроїв",
  infra_telecom_modern_firmware: "Оновлення прошивки",
  infra_telecom_modern_optim: "Оптимізація енергоспоживання",
  infra_telecom_serv: "Технічне обслуговування",
  infra_telecom_serv_check: "Регулярні перевірки",
  infra_telecom_serv_clean: "Чищення обладнання",
  infra_telecom_serv_config: "Налаштування систем",

  // Персонал
  staff: "Персонал",
  staff_tech: "Технічний персонал",
  staff_tech_salary: "Заробітна плата",
  staff_tech_salary_base: "Базова заробітна плата",
  staff_tech_salary_bonus: "Премії",
  staff_tech_salary_compensation: "Компенсації",
  staff_tech_insurance: "Страхування",
  staff_tech_insurance_health: "Медичне страхування",
  staff_tech_insurance_life: "Страхування життя",
  staff_tech_insurance_pension: "Пенсійне забезпечення",
  staff_admin: "Адміністративний персонал",
  staff_admin_salary: "Заробітна плата",
  staff_admin_salary_base: "Базова заробітна плата",
  staff_admin_salary_bonus: "Премії",
  staff_admin_salary_compensation: "Компенсації",
  staff_admin_salary_overtime: "Оплата понаднормових годин",
  staff_admin_dev: "Професійний розвиток",
  staff_admin_dev_courses: "Навчальні курси",
  staff_admin_dev_certification: "Сертифікація",
  staff_admin_dev_training: "Тренінги",
  staff_support: "Підтримка персоналу",
  staff_support_expenses: "Компенсації витрат",
  staff_support_expenses_transport: "Транспортні витрати",
  staff_support_expenses_meals: "Харчування",
  staff_support_expenses_travel: "Відрядження",
  staff_support_expenses_accommodation: "Проживання",
  staff_support_bonus: "Премії за успіхи",
  staff_support_bonus_innov: "За інновації",
  staff_support_bonus_perf: "За продуктивність",
  staff_support_bonus_achiev: "За досягнення",

  // Технічна підтримка
  support: "Технічна підтримка",
  support_client: "Підтримка клієнтів",
  support_client_training: "Навчання персоналу",
  support_client_training_courses: "Курси",
  support_client_training_workshops: "Тренінги",
  support_client_training_seminars: "Семінари",
  support_client_equip: "Обладнання",
  support_client_equip_computers: "Комп'ютери",
  support_client_equip_headsets: "Гарнітури",
  support_client_equip_software: "Програмне забезпечення",
  support_client_equip_comms: "Системи зв'язку",
  support_tech: "Технічне обслуговування",
  support_tech_repair: "Ремонт обладнання",
  support_tech_repair_parts: "Заміна деталей",
  support_tech_repair_diagnosis: "Діагностика",
  support_tech_repair_devices: "Ремонт пристроїв",
  support_tech_update: "Оновлення ПЗ",
  support_tech_update_license: "Ліцензії",
  support_tech_update_system: "Оновлення систем",
  support_tech_update_compat: "Підтримка сумісності",
  support_tech_update_migration: "Міграція даних",

  admin: "Адміністративні витрати",
  admin_office: "Офісні витрати",
  admin_office_rent: "Оренда",
  admin_office_rent_office: "Оренда офісів",
  admin_office_rent_parking: "Парковка",
  admin_office_rent_utilities: "Комунальні послуги",
  admin_office_supplies: "Канцелярія",
  admin_office_supplies_paper: "Папір",
  admin_office_supplies_cartridges: "Картриджі",
  admin_office_supplies_furniture: "Офісні меблі",
  admin_office_supplies_presentation: "Обладнання для презентацій",
  admin_marketing: "Маркетинг",
  admin_marketing_ads: "Реклама",
  admin_marketing_ads_online: "Онлайн реклама",
  admin_marketing_ads_print: "Друкована реклама",
  admin_marketing_ads_tv: "Телевізійна реклама",
  admin_marketing_ads_radio: "Радіо реклама",
  admin_marketing_events: "Події",
  admin_marketing_events_promos: "Промоакції",
  admin_marketing_events_expos: "Виставки",
  admin_marketing_events_conferences: "Конференції",
  admin_market: "Дослідження ринку",
  admin_market_research: "Аналіз",
  admin_market_research_competitors: "Аналіз конкурентів",
  admin_market_research_demand: "Оцінка споживчого попиту",
  admin_market_research_surveys: "Опитування клієнтів",

  // Додаткові послуги
  extra: "Додаткові послуги",
  extra_consult: "Консалтинг",
  extra_consult_outsourcing: "Зовнішні послуги",
  extra_consult_outsourcing_legal: "Юридичний консалтинг",
  extra_consult_outsourcing_finance: "Фінансовий консалтинг",
  extra_consult_outsourcing_hr: "HR консалтинг",
  extra_consult_info: "Інформаційна підтримка",
  extra_consult_info_research: "Дослідження ринку",
  extra_consult_info_reports: "Звіти",
  extra_consult_info_reviews: "Аналітичні огляди",
  extra_security: "Послуги безпеки",
  extra_security_guard: "Охорона",
  extra_security_guard_premises: "Охорона приміщень",
  extra_security_guard_cameras: "Камери спостереження",
  extra_security_guard_alarm: "Сигналізація",
  extra_security_guard_turnstiles: "Турнікети",
  extra_security_cyber: "Кібербезпека",
  extra_security_cyber_antivirus: "Антивірусні ліцензії",
  extra_security_cyber_monitoring: "Моніторинг мережі",
  extra_security_cyber_data: "Захист даних",
  extra_security_cyber_training: "Навчання з безпеки",
  extra_it_outsource: "ІТ-аутсорсинг",
  extra_it_outsource_sys_mgmt: "Управління системами",
  extra_it_outsource_remote_admin: "Віддалене адміністрування",
  extra_it_outsource_tech_support: "Технічна підтримка на замовлення",
  extra_it_outsource_infra_mgmt: "Управління мережами",
  extra_it_outsource_access_ctrl: "Контроль доступу",
  extra_it_outsource_security: "Системна безпека"
};



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
              data: Object.keys(data).map(key0 => ({
                name: key0,
                value: data[key0].total,
                // colorSaturation: [0.5, 0.6, 0.7],
                
                children: Object.keys(data[key0].values).map(key1 => ({
                  name: expenseCategories[key1],
                  value: data[key0].values[key1].total,

                  children: Object.keys(data[key0].values[key1].values).map(key2 => ({
                    name: expenseCategories[key2],
                    value: data[key0].values[key1].values[key2].total,

                    children: Object.keys(data[key0].values[key1].values[key2].values).map(key3 => ({
                      name: expenseCategories[key3],
                      value: data[key0].values[key1].values[key2].values[key3].total
                    }))
                  }))
                }))
              }))
            }
          ]
        };

        setChartOption(option)
      }

    }, [data])

    const readData = async () => {
      const dataFile = '/data/expenses-5000.csv';
      const parsedData = await dataResolver.read(dataFile)
      const normalized = []
      parsedData.forEach(item => {
        if (!normalized[item.category0]) {
          normalized[item.category0] = {
            total: 0,
            values: []
          }
        }
        normalized[item.category0].total += parseInt(item.price, 10)

        if (!normalized[item.category0].values[item.category1]) {
          normalized[item.category0].values[item.category1] = {
            total: 0,
            values: []
          }
        }
        normalized[item.category0].values[item.category1].total += parseInt(item.price, 10)

        if (!normalized[item.category0].values[item.category1].values[item.category2]) {
          normalized[item.category0].values[item.category1].values[item.category2] = {
            total: 0,
            values: []
          }
        }
        normalized[item.category0].values[item.category1].values[item.category2].total += parseInt(item.price, 10)

        if (!normalized[item.category0].values[item.category1].values[item.category2].values[item.category3]) {
          normalized[item.category0].values[item.category1].values[item.category2].values[item.category3] = {
            total: 0,
          }
        }
        normalized[item.category0].values[item.category1].values[item.category2].values[item.category3].total += parseInt(item.price, 10)
      })

      setData(normalized);
    }

    return chartOption && <ReactECharts option={chartOption} style={{height: '100%'}}/>;
}
export default Expenses;