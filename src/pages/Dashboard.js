import Ratings from "../components/Radar/Ratings";
import AgeGroups from "../components/Segment/AgeGroups";
import CityAgeGroups from "../components/Segment/CityAgeGroups";
import Expenses from "../components/Treemap/Expenses";

const Dashboard = () => {
    return <div className="root-grid-container">
        <div className="grid-item chart-wrapper">
            <AgeGroups/>
        </div>
        <div className="grid-item chart-wrapper">
            <CityAgeGroups/>
        </div>
        <div className="grid-item chart-wrapper">
            <Ratings />
        </div>
        <div className="grid-item chart-wrapper">
            <Expenses />
        </div>
        <div className="grid-item chart-wrapper">
            <CityAgeGroups/>
        </div>
        
        <div className="grid-item chart-wrapper">6</div>
    </div>
}
export default Dashboard;