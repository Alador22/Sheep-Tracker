import React, { useState } from "react";
import "./LeggTil.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LeggTil() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      alert("Passordene matcher ikke.");
      return;
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/user/signup",
        {
          firstName,
          lastName,
          email,
          password,
        }
      );
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      alert("Bruker registrert!");
      navigate("/Login");
    } catch (error) {
      console.error(
        "Kunne ikke lage konto:",
        error.response ? error.response.data : error
      );
      alert("Feil ved opprettelse av brukerkonto.");
    }
  };

  return (
    <div className="bod">
      <div className="Main">
        <form className="Login" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Fornavn"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Etternavn"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Gjenta Passord"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          <button type="submit">Registrer bruker</button>
        </form>
      </div>
    </div>
  );
}

export default LeggTil;
