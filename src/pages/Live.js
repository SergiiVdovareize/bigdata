import { useEffect, useRef, useState } from "react";
import CodeRate from "../components/Telecom/CodeRate";
import LiveLine from "../components/Telecom/LiveLine";
import dataResolver from "../utils/dataResolver";
import Menu from "../components/Elements/Menu";
import LeafletMap from "../components/Map/LeafletMap";
import Throughput from "../components/Telecom/Throughput";
import { defaultBandwidth, defaultMIMOLayers } from "../constants/constants";

const propsMap = {
    rsrp: 'RSRP',
    rsrq: 'RSRQ',
    cqi: 'CQI',
    timestamp: 'Timestamp',
    lng: 'Longitude',
    lat: 'Latitude',
    snr: 'SNR',
}

const numberProps = ['rsrp', 'rsrq', 'cqi', 'snr', 'lat', 'lng']


const Live = () => {
    const [data, setData] = useState(null);
    const cashedData = useRef(null);
    const timeoutId = useRef(null);

    const [position, setPosition] = useState({});
    const [path, setPath] = useState([]);
    const [bandwidth, setBandwidth] = useState(defaultBandwidth);
    const [mimo, setMimo] = useState(defaultMIMOLayers);
    
    const visibleLength = 200;
    const currentIndex = useRef(visibleLength);

    useEffect(() => {
        readData('pedestrian');
    }, [])

    useEffect(() => {
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

        const updatedData = {}

        Object.keys(propsMap).forEach(prop => {
            updatedData[prop] = [...data[prop]]
        })
        
        Object.keys(propsMap).forEach(prop => {
            updatedData[prop]?.shift()
            updatedData[prop]?.push(cashedData.current[prop][currentIndex.current])
        })

        currentIndex.current = currentIndex.current >= cashedData.current.rsrq.length ? 0 : currentIndex.current + 1
        setData(updatedData)

        const position = { lat: updatedData?.lat[visibleLength-1], lng: updatedData?.lng[visibleLength-1] };
        setPosition(position)

        if (path[path.length-1][0] !== position.lat || path[path.length-1][1] !== position.lng) {
            setPath([...path, [position.lat, position.lng]])
        }
    }

    const readData = async (type = null, refreshPath = false) => {
        // const fileName = 'A_2017.11.21_15.35.33.csv';
        const parsedData = await dataResolver.readDataType(type)
        const normalized = {}
        Object.keys(propsMap).forEach(prop => {
            normalized[prop] = []
        })

        parsedData.forEach(line => {
            if (!line.RSRP || !line.RSRQ || !line.Timestamp) {
                return
            }

            Object.entries(propsMap).forEach(([key, value]) => {
                if (key === 'timestamp') {
                    const dt = line[value].split('_');
                    const formattedDate = dt[1].replaceAll('.', ':')
                    normalized[key].push(formattedDate)
                } else {
                    normalized[key].push(numberProps.includes(key) ? parseFloat(line[value], 10) : line[value])
                }
            })
        })

        cashedData.current = normalized;

        const visible = {}
        Object.keys(propsMap).forEach(prop => {
            visible[prop] = normalized[prop].slice(0, visibleLength)
        })

        
        
        setPath([[visible?.lat[visibleLength-1], visible?.lng[visibleLength-1]]])
        setData(visible);
    }

    const onTestDataChange = ({value}) => {
        readData(value, true);
    }

    const onBandwidthChange = ({value}) => {
        setBandwidth(value)
    }

    const onMimoChange = ({value}) => {
        setMimo(value)
    }

    return <div className="root-container">
        <div className="home-container">
            <div className="left-column">
                <div className="cell chart-wrapper">
                    <LiveLine params={rsrqParams} data={data}>
                        <div className="floating-menu-container">
                            <Menu 
                                onTestDataChange={onTestDataChange}
                                onBandwidthChange={onBandwidthChange}
                                onMimoChange={onMimoChange}/>
                        </div>
                    </LiveLine>
                </div>
                <div className="cell chart-wrapper">
                    <LiveLine params={rsrpParams} data={data}/>
                </div>
                <div className="cell chart-wrapper">
                    <LiveLine params={cqiParams} data={data}/>
                </div>
            </div>
            <div className="right-column">
                <div className="cell chart-wrapper">
                    <CodeRate data={data}/>
                </div>
                <div className="cell chart-wrapper">
                    <Throughput data={data} bandwidth={bandwidth} mimo={mimo}/>
                </div>
                <div className="cell chart-wrapper">
                    <LeafletMap position={position} path={path}/>
                </div>
            </div>
        </div>
    </div>
}
export default Live;