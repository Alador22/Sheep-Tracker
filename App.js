import React, { useState } from 'react';
import './App.css';

function App() {
  const items = ['Marie', 'Ingrid', 'Rolf', 'Kevin', 'Leif', 'Jenny', 'Ali'];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
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
          <button class="leggTilButton">Legg til sau</button>
          <button>Fjern sau</button>
        </div>
      </header>
    </div>
  );
}

export default App;