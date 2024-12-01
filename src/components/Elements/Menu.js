import React from 'react'
import Select from 'react-select'
import { bandwidthOptions, mimoOptions, testDataOptions } from '../../constants/constants'

const Menu = (params) => {
  const {onTestDataChange, onBandwidthChange, onMimoChange} = params

    return  <div className='main-menu'>
      <div className='menu-item'>
        <label htmlFor="data-type" className='select-label'>
          Data type
        </label>
        <Select 
          inputId='data-type'
          className='selector'
          placeholder='Choose test data'
          defaultValue={testDataOptions[1]}
          onChange={onTestDataChange}
          isClearable={false}
          isSearchable={false}
          options={testDataOptions} />
      </div>

      <div className='menu-item'>
        <label htmlFor="bandwidth-type" className='select-label'>
          Bandwidth
        </label>
        <Select
          inputId='bandwidth-type'
          className='selector'
          placeholder='Choose bandwidth'
          defaultValue={bandwidthOptions[3]}
          onChange={onBandwidthChange}
          isClearable={false}
          isSearchable={false}
          options={bandwidthOptions} />
      </div>

      <div className='menu-item'>
        <label htmlFor="bandwidth-type" className='select-label'>
          MIMO Layers
        </label>
        <Select
          inputId='bandwidth-type'
          className='selector'
          placeholder='Choose bandwidth'
          defaultValue={mimoOptions[0]}
          onChange={onMimoChange}
          isClearable={false}
          isSearchable={false}
          options={mimoOptions} />
      </div>
    </div>
}
export default Menu;