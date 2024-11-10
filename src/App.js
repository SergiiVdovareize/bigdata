import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Live from './pages/Live';

const App = () => {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live" element={<Live />} />
          </Routes>
        </Router>
      );
}
export default App;