import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Live from './pages/Live';
import { HashRouter, Route, Routes } from 'react-router-dom';

const App = () => {
    return (
        <HashRouter>
          <Routes>
            <Route path="/" element={<Live />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </HashRouter>
      );
}
export default App;