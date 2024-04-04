import './login.css';
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/login', {
        email,
        password,
      });

      console.log('Login successful:', response.data);
      
      <Link to={"/App"}></Link>
      
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data.message : error.message);
      
    }
  };

  return (
    <div className="Main">
      <div className="Login">
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Passord"
          value={password}
          onChange={handleInputChange}
        />
        <button onClick={handleLogin}>Logg inn</button>
        {}
        <button>Lag bruker</button>
      </div>
    </div>
  );
}

export default Login;


