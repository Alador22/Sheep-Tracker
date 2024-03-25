import './Login.css';
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
        password
      });

      console.log('Login successful:', response.data);
      // Handle successful login here 

    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data.message : error.message);
      console.log(error.response ? error.response.data.message : error.message)
      // Handle login failure here 
    }
  };
  return (

    <div className="Main">
      <div className="Login">

      <input type="text" placeholder="Email"></input>
      <input type="password" placeholder="Passord"></input>
      <button>Logg inn</button>
    
      <button>Lag bruker</button>
        
      </div>
    </div>
  );
}

export default Login;
