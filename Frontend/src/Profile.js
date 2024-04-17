import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setFirstName(decodedToken.firstName);
      setLastName(decodedToken.lastName);
      setEmail(decodedToken.email);
    }
  }, []);

  console.log(firstName, lastName, email);

  const handleEmailChange = (e) => {
    e.preventDefault();
    // Call to backend to update email
    axios
      .post("http://localhost:5000/user/profile", { email, currentPassword })
      .then((response) => alert("Email updated successfully!"))
      .catch((error) => alert("Failed to update email!"));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Call to backend to update password
    axios
      .patch("http://localhost:5000/user/profile", {
        newPassword,
        currentPassword,
      })
      .then((response) => alert("Password updated successfully!"))
      .catch((error) => alert("Failed to update password!"));
  };

  const handleAccountDeletion = (e) => {
    e.preventDefault();
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // Call to backend to delete account
      axios
        .delete("http://localhost:5000/user/profile", { currentPassword })
        .then((response) => {
          alert("Account deleted successfully!");
          // Redirect or perform additional cleanup
        })
        .catch((error) => alert("Failed to delete account!"));
    }
  };

  return (
    <div className="Profile">
      <h1>Profile Settings</h1>
      <form onSubmit={handleEmailChange}>
        <label>
          New Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit">Change Email</button>
      </form>
      <form onSubmit={handlePasswordChange}>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label>
          Current Password:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <button type="submit">Change Password</button>
      </form>
      <button
        onClick={handleAccountDeletion}
        style={{ marginTop: "20px", color: "red" }}
      >
        Delete Account
      </button>
    </div>
  );
}

export default Profile;
