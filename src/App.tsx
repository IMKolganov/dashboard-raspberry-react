import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import AboutPage from './components/AboutPage';
import UploadFilePage from './components/UploadFilePage';
import ContactPage from './components/ContactPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul className="nav-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/uploadfile">Upload file</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/uploadfile" element={<UploadFilePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </main>
        <footer>
          &copy; 2024 Ivan Kolganov
        </footer>
      </div>
      <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    </Router>
  );
}

export default App;

// docker stop dashboard-raspberry-react-container || true && \
// docker rm dashboard-raspberry-react-container || true && \
// docker build -t dashboard-raspberry-react . && \
// docker run -d -p 3000:3000 --name dashboard-raspberry-react-container dashboard-raspberry-react;