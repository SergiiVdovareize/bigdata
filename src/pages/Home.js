import TelecomLine from "../components/Telecom/TelecomLine";
import TelecomLine2 from "../components/Telecom/TelecomLineV2";

const Home = () => {
    return <div class="home-container">
        <div class="left-column">
            <div class="cell chart-wrapper">
                <TelecomLine2 />
            </div>
            <div class="cell chart-wrapper">Left Cell 2</div>
        </div>
        <div class="right-column">
            <div class="cell chart-wrapper">Right Cell 1</div>
            <div class="cell chart-wrapper">Right Cell 2</div>
            <div class="cell chart-wrapper">Right Cell 3</div>
        </div>
    </div>
}
export default Home;