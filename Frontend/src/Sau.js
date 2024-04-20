import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Sau.css";

function Sau({ handleRefresh }) {
  const [sheepData, setSheepData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sheepId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSheepData = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + `/sheeps/${sheepId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data.sheep;
        setSheepData(data);
        setFormData({
          name: data.name,
          birthdate: data.birthdate ? data.birthdate.split("T")[0] : "",
          merkeNr: data.merkeNr,
          klaveNr: data.klaveNr,
          dead: data.dead ? data.dead.split("T")[0] : "",
          father: data.father,
          mother: data.mother,
        });
      } catch (error) {
        console.error("Error fetching sheep data:", error);
        setError("Failed to fetch sheep data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSheepData();
  }, [sheepId]);

  const deleteSheep = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        process.env.REACT_APP_BACKEND_URL + `/sheeps/${sheepId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(response.Data);
      handleRefresh();
      navigate("/");
    } catch (error) {
      console.error("Error deleting sheep:", error);
      setError("Error deleting sheep");
      setIsLoading(false);
    }
  };

  const updateSheep = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        process.env.REACT_APP_BACKEND_URL + `/sheeps/${sheepId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setSheepData(formData);
      setEditMode(false);
      handleRefresh();
    } catch (error) {
      console.error("Error updating sheep:", error);
      setError("Error updating sheep");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    if (editMode) {
      updateSheep();
    }
    setEditMode(!editMode);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="page">
      <div className="sau-container">
        <h1>Sau Info</h1>
        {Object.entries(formData).map(([key, value]) => {
          if (key === "merkeNr") {
            return (
              <div key={key} className="sau-detail">
                <strong>{key}:</strong> {sheepData[key]}
              </div>
            );
          }
          return (
            <div key={key} className="sau-detail">
              <strong>{key}:</strong>
              {editMode ? (
                <input
                  type={key === "birthdate" || key === "dead" ? "date" : "text"}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                />
              ) : (
                <span> {key === "dead" && !value ? "Nei" : value}</span>
              )}
            </div>
          );
        })}
        <button
          onClick={deleteSheep}
          style={{ marginTop: "20px", marginRight: "10px" }}
        >
          Delete Sheep
        </button>
        <button
          onClick={toggleEditMode}
          style={{ marginTop: "20px", marginLeft: "10px" }}
        >
          {editMode ? "Save Changes" : "Edit Info"}
        </button>
      </div>
    </div>
  );
}
export default Sau;
