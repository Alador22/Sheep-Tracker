import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Login";
import LeggTil from "./LeggTil";
import Sau from "./Sau";
import Registrer from "./Registrer";
import Profile from "./Profile";

function App() {
  const [sheeps, setSheeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(false);

  useEffect(() => {
    const fetchSheepNames = async () => {
      try {
        const token = localStorage.getItem("token");
        /*if (!token) {
          console.error('No token found, redirecting to login');
          
          //return;
        }
      */
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/sheeps",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data && Array.isArray(response.data.sheeps)) {
          setSheeps(response.data.sheeps);
        } else {
          throw new Error("Data received is not an array");
        }
      } catch (error) {
        //console.error('Error fetching sheep names:', error);
        //setError('Failed to fetch sheep names: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchSheepNames();
  }, [updateTrigger]);

  const filteredItems = sheeps.filter(
    (sheep) =>
      sheep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheep.merkeNr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    setUpdateTrigger((prev) => !prev);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Forside</Link> | <Link to="/login">Login</Link> |
          <Link to="/LeggTil">LeggTil</Link> | <Link to="/Sau">Sau</Link> |
          <Link to="/Registrer">Registrer</Link> |{" "}
          <Link to="/Profile">Profile</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/LeggTil" element={<LeggTil />} />
          <Route path="/Sau/:id" element={<Sau />} />
          <Route
            path="/Registrer"
            element={
              <Registrer
                handleRefresh={() => setUpdateTrigger((prev) => !prev)}
              />
            }
          />
          <Route path="/Profile" element={<Profile />} />
          <Route
            path="/"
            element={
              <HomePage
                sheeps={filteredItems}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage({ sheeps, searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  return (
    <div className="maindiv">
      <header className="App-header">
        <input
          type="text"
          placeholder="Søk..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="list-container">
          <ul>
            {sheeps.map((sheep, index) => (
              <li key={index} onClick={() => navigate(`/Sau/${sheep.id}`)}>
                {`${sheep.name} - MerkeNr: ${sheep.merkeNr}`}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
