import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './Login';

function App() {
  const items = ['Marie', 'Ingrid', 'Rolf', 'Kevin', 'Leif', 'Jenny', 'Ali'];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <div className="App">
        {/* Navigation example, can be placed elsewhere in your app */}
        <nav>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link>
        </nav>

        {/* Define your routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
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
                  <div className="buttons-container">
                    <button className="leggTilButton">Legg til sau</button>
                    <button>Fjern sau</button>
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