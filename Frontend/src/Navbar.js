import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
    setIsNavExpanded(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <button
          className="navbar-toggle"
          aria-expanded={isNavExpanded}
          aria-label="Toggle navigation"
          onClick={() => setIsNavExpanded(!isNavExpanded)}
        >
          &#9776;
        </button>
        <div className={`nav-menu ${isNavExpanded ? "expanded" : ""}`}>
          {isLoggedIn ? (
            <>
              <Link to="/" onClick={() => setIsNavExpanded(false)}>
                Forside
              </Link>
              <Link to="/registrer" onClick={() => setIsNavExpanded(false)}>
                Legg Sau
              </Link>
              <Link to="/profile" onClick={() => setIsNavExpanded(false)}>
                Profil
              </Link>
              <a href="/login" onClick={handleLogout}>
                Logg ut
              </a>
            </>
          ) : (
            <Link to="/login">Sheep Tracker</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
