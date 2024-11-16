import { useEffect, useRef, useState } from "react";
import CodeRate from "../components/Telecom/CodeRate";
import LiveLine from "../components/Telecom/LiveLine";
import TelecomLine2 from "../components/Telecom/TelecomLineV2";
import dataResolver from "../utils/dataResolver";
import Menu from "../components/Elements/Menu";
import LeafletMap from "../components/Map/LeafletMap";

const Live = () => {
    const [data, setData] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const cashedData = useRef(null);
    const timeoutId = useRef(null);
    
    const visibleLength = 200;
    const currentIndex = useRef(visibleLength);

    useEffect(() => {
        readData('pedestrian');
    }, [])

    useEffect(() => {
        console.log('useEffect')
        if (timeoutId.current) {
            clearTimeout(timeoutId.current)
        }

        timeoutId.current = setTimeout(watchData, 1000)
    }, [data?.rsrq])

    const rsrqParams = {
        text: 'RSRQ Live',
        attr: 'rsrq',
        color: 'brown',
        min: -20,
        max: -5
    }

    const rsrpParams = {
        text: 'RSRP Live',
        attr: 'rsrp',
        color: 'red',
        min: -120,
        max: -60
    }

    const cqiParams = {
        text: 'CQI Live',
        attr: 'cqi',
        color: 'green',
        min: 0,
        max: 20
    }

    const rateParams = {
        text: 'Code Rate',
        attr: 'cqi',
    }

    const watchData = () => {
        if (!data) {
            return;
        }
        const updatedData = {
          rsrq: [...data.rsrq],
          rsrp: [...data.rsrp],
          cqi: [...data.cqi],
          timestamp: [...data.timestamp]
        }
    
        
        updatedData.rsrq.shift()
        updatedData.rsrq.push(cashedData.current.rsrq[currentIndex.current])
    
        updatedData.rsrp.shift()
        updatedData.rsrp.push(cashedData.current.rsrp[currentIndex.current])
    
        updatedData.cqi.shift()
        updatedData.cqi.push(cashedData.current.cqi[currentIndex.current])
    
        updatedData.timestamp.shift()
        updatedData.timestamp.push(cashedData.current.timestamp[currentIndex.current])
    
        currentIndex.current = currentIndex.current >= cashedData.current.rsrq.length ? 0 : currentIndex.current + 1
        setData(updatedData)
    }

    const readData = async (type = null) => {
        // const fileName = 'A_2017.11.21_15.35.33.csv';
        const parsedData = await dataResolver.readDataType(type)
        const normalized = {
            rsrp: [],
            rsrq: [],
            cqi: [],
            timestamp: [],
            long: [],
            lat: [],
        }

        parsedData.forEach(line => {
            if (!line.RSRP || !line.RSRQ || !line.Timestamp) {
                return
            }

            normalized.rsrp.push(line.RSRP)
            normalized.rsrq.push(line.RSRQ)
            normalized.cqi.push(line.CQI)
            normalized.long.push(line.Longitude)
            normalized.lat.push(line.Latitude)

            const dt = line.Timestamp.split('_');
            const formattedDate = dt[1].replaceAll('.', ':')
            normalized.timestamp.push(formattedDate)
        })

        cashedData.current = normalized;

        const visible = {
            rsrq: normalized.rsrq.slice(0, visibleLength),
            rsrp: normalized.rsrp.slice(0, visibleLength),
            cqi: normalized.cqi.slice(0, visibleLength),
            long: normalized.long.slice(0, visibleLength),
            lat: normalized.lat.slice(0, visibleLength),
            timestamp: normalized.timestamp.slice(0, visibleLength)
        }

        setData(visible);
    }

    const onTestDataChange = ({value}) => {
        readData(value);
    }

    return <div className="root-container">
        <div className="menu-container">
            <Menu onTestDataChange={onTestDataChange}/>
        </div>
        <div className="home-container">
            <div className="left-column">
                <div className="cell chart-wrapper">
                    <LiveLine params={rsrqParams} data={data}/>
                </div>
                <div className="cell chart-wrapper">
                    <LiveLine params={rsrpParams} data={data}/>
                </div>
            </div>
            <div className="right-column">
                <div className="cell chart-wrapper">
                    <LiveLine params={cqiParams} data={data}/>
                </div>
                <div className="cell chart-wrapper">
                    <CodeRate data={data}/>
                </div>
                <div className="cell chart-wrapper">
                    <LeafletMap lat={data?.lat[currentIndex.current]} lng={data?.long[currentIndex.current]}/>
                </div>
            </div>
        </div>
    </div>
}
export default Live;