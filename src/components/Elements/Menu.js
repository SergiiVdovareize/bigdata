import React from 'react'
import Select from 'react-select'

const bandwidthOptions = [
  { value: 1, label: '1.4Mhz' },
  { value: 3, label: '3Mhz' },
  { value: 5, label: '5Mhz' },
  { value: 10, label: '10Mhz' },
  { value: 15, label: '15Mhz' },
  { value: 20, label: '20Mhz' },
]

const testDataOptions = [
  { value: 'static', label: 'Static' },
  { value: 'pedestrian', label: 'Pedestrian' },
  { value: 'car', label: 'Car' },
  { value: 'bus', label: 'Bus' },
  { value: 'train', label: 'Train' },
]

const Menu = (params) => {
  const {onTestDataChange} = params

    return  <div className='main-menu'>
      <div className='menu-item'>
        <Select 
            className='selector'
            placeholder='Choose test data'
            defaultValue={testDataOptions[1]}
            onChange={onTestDataChange}
            options={testDataOptions} />
      </div>

      <div className='menu-item'>
        <Select 
            className='selector'
            placeholder='Choose bandwidth'
            options={bandwidthOptions} />
      </div>

      
    </div>
}
export default Menu;