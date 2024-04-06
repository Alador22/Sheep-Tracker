import React, { useState } from 'react';
import './LeggTil.css';
import axios from 'axios';

function LeggTil() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (password !== repeatPassword) {
      alert('Passordene matcher ikke. Prøv igjen.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/user/signup', {
        firstName,
        lastName,
        email,
        password,
      });
      console.log(response.data);
      // Send bruker til logginn eller forsiden.
      alert('Bruker registrert!');
    } catch (error) {
      console.error('Error creating account:', error.response ? error.response.data : error);
      alert('Feil ved opprettelse av brukerkonto.');
    }
  };

  return (
    <div className="bod">
    <div className="Main">
      <form className="Login" onSubmit={handleSubmit}>
        <input type="text" placeholder="Fornavn" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="text" placeholder="Etternavn" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Passord" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Gjenta Passord" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
        <button type="submit">Registrer bruker</button>
      </form>
    </div>
    </div>
  );
}

export default LeggTil;