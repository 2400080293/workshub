import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import Workshops from './pages/Workshops';
import WorkshopDetails from './pages/WorkshopDetails';
import CreateWorkshop from './pages/CreateWorkshop';
import MyRegistrations from './pages/MyRegistrations';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Online Workshop Management</h1>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/workshops">Workshops</Link>
            <Link to="/create">Create</Link>
            <Link to="/my-registrations">My Registrations</Link>
            <Link to="/login">Login</Link>
          </nav>
        </header>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/workshops/:id" element={<WorkshopDetails />} />
            <Route path="/create" element={<CreateWorkshop />} />
            <Route path="/my-registrations" element={<MyRegistrations />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <footer className="App-footer">© 2025 Workshop Manager</footer>
      </div>
    </Router>
  );
}

export default App;
