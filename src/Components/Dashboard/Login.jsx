import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import '../Dashboard/index.css';

const Login = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   
      const response = await axios.post('http://localhost:5000/api/login/LU', { email, password });

      const { token, role } = response.data;

      setMessage('Login successful!');
      login(role);

     
      if (role === 'admin') {
        navigate('/');
      } else {
        navigate('/home');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="container">
      <Nav className="justify-content-between">
        <Nav.Item>
          <img src='logo.png' className='logo' alt="Logo"/>
        </Nav.Item>
        <Nav.Item className="ml-auto mt-4">
          <Link to="/register">
            <Button variant="primary" className="m-2">Register</Button>
          </Link>
          <Link to="/login">
            <Button variant="dark" className="mr-4">Login</Button>
          </Link>
        </Nav.Item>
      </Nav>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-4">
          <img src='/user.png' alt="Leoni" className="img"/>
        </div>
        <div className="col-md-6">
          <h2 className="mt-5">Login</h2>
          <form onSubmit={handleSubmit} className="mt-3">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input 
                type="email" 
                id="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input 
                type="password" 
                id="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Login</button>
          </form>
          {message && <p className="mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;