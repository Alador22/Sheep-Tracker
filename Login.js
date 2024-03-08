import './Login.css';

function Login() {
  return (

    <div className="Main">
      <div className="Login">

      <input type="text" placeholder="Email"></input>
      <input type="password" placeholder="Passord"></input>
      <button>Logg inn</button>
    
      <button>Lag bruker</button>
        
      </div>
    </div>
  );
}

export default Login;
