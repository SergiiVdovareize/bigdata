import React from 'react'
import Select from 'react-select'
import { bandwidthOptions, testDataOptions } from '../../constants/constants'

const Menu = (params) => {
  const {onTestDataChange, onBandwidthChange, bandwidth} = params

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
            defaultValue={bandwidthOptions[3]}
            onChange={onBandwidthChange}
            options={bandwidthOptions} />
      </div>

      
    </div>
}
export default Menu;