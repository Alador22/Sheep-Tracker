import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './Login';
import LeggTil from './LeggTil';
import Sau from './Sau';
import Registrer from './Registrer';
import Profile from './Profile';

function App() {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchSheepNames = async () => {
      try {
        const token = localStorage.getItem('token');
        /*if (!token) {
          console.error('No token found, redirecting to login');
          
          //return;
        }
      */
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/sheeps', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.sheeps)) {
          setNames(response.data.sheeps.map(sheep => sheep.name));
        } else {
          throw new Error('Data received is not an array');
        }
      } catch (error) {
        //console.error('Error fetching sheep names:', error);
        //setError('Failed to fetch sheep names: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchSheepNames();
  }, []);

  const filteredItems = names.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Forside</Link> | <Link to="/login">Login</Link>
          | <Link to="/LeggTil">LeggTil</Link> | <Link to="/Sau">Sau</Link>
          | <Link to="/Registrer">Registrer</Link> <Link to="/Profile"></Link>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/LeggTil" element={<LeggTil />} />
          <Route path="/Sau" element={<Sau />} />
          <Route path="/Registrer" element={<Registrer />} />
          <Route path="/Profile" element={<Profile />} />
          <Route
            path="/"
            element={
              <div className='maindiv'>
                <header className="App-header">
                  <input
                    type="text"
                    placeholder="Søk..."
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <div className="list-container">
                    <ul>
                      {filteredItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </header>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;