import Ratings from './Radar/Ratings';
import AgeGroups from './Segment/AgeGroups';
import CityAgeGroups from './Segment/CityAgeGroups';
import CityGroups from './Segment/CityGroups';
import Expenses from './Treemap/Expenses';

const Container = () => {
    return <div className="root-grid-container">
        <div className="grid-item">
            <AgeGroups/>
        </div>
        <div className="grid-item">
            <CityGroups/>
        </div>
        <div className="grid-item">
            <Ratings />
        </div>
        <div className="grid-item">
            <Expenses />
        </div>
        <div className="grid-item">
            <CityAgeGroups/>
        </div>
        
        <div className="grid-item">6</div>
    </div>
}
export default Container;