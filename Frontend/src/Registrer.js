import React, { useState } from "react";
import axios from "axios";
import "./Registrer.css";

function Register({ handleRefresh }) {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    merkeNr: "",
    klaveNr: "",
    dead: "",
    father: "",
    mother: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/sheeps/save",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(response.data);
      alert("Sheep registered successfully!");
      handleRefresh();
    } catch (error) {
      console.error("Failed to register sheep:", error);
      alert("Failed to register sheep.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register Sheep</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Navn"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthdate"
          placeholder="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="merkeNr"
          placeholder="Merkenummer"
          value={formData.merkeNr}
          onChange={handleChange}
        />
        <input
          type="text"
          name="klaveNr"
          placeholder="klaveNr"
          value={formData.klaveNr}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dead"
          placeholder="dead"
          value={formData.dead}
          onChange={handleChange}
        />
        <input
          type="text"
          name="father"
          placeholder="Fars merkenr"
          value={formData.father}
          onChange={handleChange}
        />
        <input
          type="text"
          name="mother"
          placeholder="Mors merkenr"
          value={formData.mother}
          onChange={handleChange}
        />
        <button type="submit">Registrer</button>
      </form>
    </div>
  );
}

export default Register;
