import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Login";
import LeggTil from "./LeggTil";
import Sau from "./Sau";
import Registrer from "./Registrer";
import Profile from "./Profile";
import Navbar from "./Navbar";
import { AuthProvider } from "./AuthContext";

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
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/sheeps",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        handleRefresh();

        if (response.data && Array.isArray(response.data.sheeps)) {
          setSheeps(response.data.sheeps);
        } else {
          throw new Error("Data received is not an array");
        }
      } catch (error) {
        console.error("Error fetching sheep names:", error);
        setError(
          "Failed to fetch sheep names: " +
            (error.response?.data?.message || error.message)
        );
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
  //if (error) return <div>Error: {error}</div>;
  /*   if (!sheeps || sheeps.length === 0) {
    return <div>No sheep data found</div>;
  }*/
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />

          <Routes>
            <Route
              path="/login"
              element={
                <Login
                  handleRefresh={() => setUpdateTrigger((prev) => !prev)}
                />
              }
            />
            <Route
              path="/LeggTil"
              element={
                <LeggTil
                  handleRefresh={() => setUpdateTrigger((prev) => !prev)}
                />
              }
            />
            <Route
              path="/Sau/:sheepId"
              element={
                <Sau handleRefresh={() => setUpdateTrigger((prev) => !prev)} />
              }
            />
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
    </AuthProvider>
  );
}

function HomePage({ sheeps, searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="maindiv">
      <header className="App-header">
        <input
          type="text"
          placeholder="Søk..."
          className="search-input"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table className="sheep-table">
          <thead>
            <tr>
              <th>Navn</th>
              <th>MerkeNr</th>
            </tr>
          </thead>
          <tbody>
            {sheeps.map((sheep, index) => (
              <tr key={index} onClick={() => navigate(`/Sau/${sheep._id}`)}>
                <td>{sheep.name}</td>
                <td>{sheep.merkeNr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
