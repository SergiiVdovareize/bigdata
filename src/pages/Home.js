import TelecomLine from "../components/Telecom/TelecomLine";
import TelecomLine2 from "../components/Telecom/TelecomLineV2";

const Home = () => {
    return <div className="home-container">
        <div className="left-column">
            <div className="cell chart-wrapper">
                <TelecomLine2 />
            </div>
            {/* <div className="cell chart-wrapper">Left Cell 2</div> */}
        </div>
        <div className="right-column">
            <div className="cell chart-wrapper">Right Cell 1</div>
            <div className="cell chart-wrapper">Right Cell 2</div>
            <div className="cell chart-wrapper">Right Cell 3</div>
        </div>
    </div>
}
export default Home;