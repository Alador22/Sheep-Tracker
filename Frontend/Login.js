import './login.css';
import React, { useState } from 'react';
import axios from 'axios';

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
      // Handle successful login here
      // e.g., navigate to a new page, store the login token, etc.
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data.message : error.message);
      // Handle login failure here
      // e.g., show an error message to the user
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
        {/* Link this button to your user registration function or page */}
        <button>Lag bruker</button>
      </div>
    </div>
  );
}

export default Login;

// test1@test.com    ,   123456
