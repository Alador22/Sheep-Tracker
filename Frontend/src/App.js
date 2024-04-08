import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './Login';
import LeggTil from './LeggTil';
import Sau from './Sau';
import Registrer from './Registrer';

function App() {
  const items = [
    'shaun', 'Ingrid', 'Rolf', 'Kevin', 'Leif', 'Jenny', 'Ali', 'Olivia', 'Noah', 
    'Emma', 'Liam', 'Sophia', 'Mason', 'Isabella', 'Jacob', 'Mia', 'William', 
    'Charlotte', 'Ethan', 'Amelia', 'James', 'Harper', 'Alexander', 'Evelyn', 
    'Michael', 'Abigail', 'Benjamin', 'Emily', 'Elijah', 'Madison', 'Daniel', 
    'Avery', 'Aiden', 'Ella', 'Logan', 'Scarlett', 'Matthew', 'Grace', 'Lucas', 
    'Chloe', 'Jackson', 'Lily', 'David', 'Aria', 'Oliver', 'Isabelle', 'Jayden', 
    'Sophie', 'Joseph', 'Layla'
  ];
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <div className="App">
        {}
        <nav>
          <Link to="/">Forside</Link> | <Link to="/login">Login</Link>
          | <Link to="/LeggTil">LeggTil</Link> | <Link to="/Sau">Sau</Link>
          | <Link to="/Registrer">Registrer</Link>
        </nav>

        {}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/LeggTil" element={<LeggTil />} />
          <Route path="/Sau" element={<Sau />} />
          <Route path="/Registrer" element={<Registrer />} />
          <Route path="/App" element={<App />} />
          
          <Route
            path="/"
            element={
              <div>
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

// test1@test.com  123456