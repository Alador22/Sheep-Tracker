import React, { useState } from 'react';
import axios from 'axios';
import './Registrer.css'; // Make sure to create a corresponding CSS file for styling

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    idNumber: '',
    father: '',
    mother: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/sheeps/save', formData);
      console.log(response.data);
      alert('Sheep registered successfully!');
    } catch (error) {
      console.error('Failed to register sheep:', error);
      alert('Failed to register sheep.');
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
          placeholder="Birthdate"
          value={formData.birthdate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="merkenummer"
          placeholder="Merkenummer"
          value={formData.idNumber}
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Register;