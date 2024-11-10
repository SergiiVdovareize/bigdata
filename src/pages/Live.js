import LiveLine from "../components/Telecom/LiveLine";
import TelecomLine2 from "../components/Telecom/TelecomLineV2";

const Live = () => {
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

    return <div className="home-container">
        <div className="left-column">
            <div className="cell chart-wrapper">
                <LiveLine params={rsrqParams}/>
            </div>
            <div className="cell chart-wrapper">
                <LiveLine params={rsrpParams}/>
            </div>
        </div>
        <div className="right-column">
            <div className="cell chart-wrapper">
                <LiveLine params={cqiParams}/>
            </div>
            <div className="cell chart-wrapper">Right Cell 2</div>
            <div className="cell chart-wrapper">Right Cell 3</div>
        </div>
    </div>
}
export default Live;