import React, { useState } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Register from './Components/Dashboard/Register';
import Login from './Components/Dashboard/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import Home from './Components/user/Home';
import GestionSite from './Components/Dashboard/GestionSite';
import GestionArticle from './Components/Dashboard/GestionArticle';
import Article from './Components/user/Article';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  const login = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('token');  
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login login={login} />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? 
              (role === 'admin' ? <Dashboard logout={logout} /> : <Navigate to="/home" />) 
              : <Navigate to="/login" />} 
          />
          <Route 
            path="/home" 
            element={isAuthenticated && role === 'user' ? <Home logout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/site" 
            element={isAuthenticated && role === 'admin' ? <GestionSite logout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/detail" 
            element={isAuthenticated && role === 'user' ? <Article logout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/article" 
            element={isAuthenticated && role === 'admin' ? <GestionArticle logout={logout} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
