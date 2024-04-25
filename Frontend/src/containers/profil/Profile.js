import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../Context/AuthContext";

function Profile() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState(""); // Renamed for clarity
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          email: decodedToken.email,
        });
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        process.env.REACT_APP_BACKEND_URL + "/user/profile",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      alert("Password updated successfully!");
      setNewPassword("");
      setOldPassword("");
    } catch (error) {
      alert("Failed to update password!");
      console.error("Password update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAccountDeletion = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(process.env.REACT_APP_BACKEND_URL + "/user/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      alert("Account deleted successfully!");
      localStorage.removeItem("token");
      handleLogout();
    } catch (error) {
      alert("Failed to delete account!");
      console.error("Account deletion error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordChange = () => {
    setShowPasswordChange((prev) => !prev);
  };
  return (
    <div className="Profile">
      <h1>Min Profil</h1>
      <div className="profile-container">
        <div className="user-info">
          <p>
            <strong>Mail:</strong> {user.email}
          </p>
          <p>
            <strong>Navn:</strong> {user.firstName} {user.lastName}
          </p>
        </div>
        <button onClick={togglePasswordChange} className="toggle-button">
          {showPasswordChange ? "Lukk" : "Endre Passord"}
        </button>
        {showPasswordChange && (
          <form onSubmit={handlePasswordChange} className="password-form">
            <label>
              Gjeldende Passord:
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </label>
            <label>
              Nytt Passord:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <button type="submit" disabled={isLoading}>
              Endre Passord
            </button>
          </form>
        )}
        <button
          onClick={handleAccountDeletion}
          className="delete-button"
          disabled={isLoading}
        >
          Slett Konto
        </button>
      </div>
    </div>
  );
}

export default Profile;
