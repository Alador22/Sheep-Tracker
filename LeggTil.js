import './LeggTil.css';

function App() {
  return (

    <div className="Main">
      <div className="Login">

      <input type="text" placeholder="Fornavn"></input>
      <input type="text" placeholder="Etternavn"></input>
      <input type="text" placeholder="Email"></input>
      <input type="password" placeholder="Passord"></input>
      <input type="password" placeholder="Gjenta Passord"></input>
      <button>Registrer bruker</button>
        
      </div>
    </div>
  );
}

export default App;
