import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import classes from './loginPage.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/login', { username, password });
      localStorage.setItem('token', data.token); // Save JWT token
      localStorage.setItem('user', username);    // Save username
      navigate('/'); // Redirect to homepage after login
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <div className={classes.registerPrompt}>
          Don't have an account? <Link to="/register">Register here</Link> {/* Link papunta sa register page */}
        </div>
      </div>
    </div>
  );
}
