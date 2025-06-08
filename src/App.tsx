import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstPage from './pages/FirstPage';
import SecPage from './pages/SecPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/2" element={<SecPage />} />
      </Routes>
    </Router>
  )
}

export default App
