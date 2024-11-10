import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Live from './pages/Live';
import { HashRouter, Route, Routes } from 'react-router-dom';

const App = () => {
    return (
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live" element={<Live />} />
          </Routes>
        </HashRouter>
      );
}
export default App;