import "./login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

function Login({ handleRefresh }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const redirectToLeggTil = () => {
    navigate("/LeggTil");
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/user/login",
        {
          email,
          password,
        }
      );
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      login(response.data.token);
      handleRefresh();
      navigate("/");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data.message : error.message
      );
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
        <button onClick={redirectToLeggTil}>Lag bruker</button>
      </div>
    </div>
  );
}

export default Login;
