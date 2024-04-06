import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Sau.css';

function Sau() {
  const [sheepData, setSheepData] = useState({});
  const { sheepId } = useParams(); 

  useEffect(() => {
    const fetchSheepData = async () => {
      try {
        // oppdater til å ikke være hardkodet
        const response = await axios.get(`http://localhost:5000/sheeps/(660aa7aca32ef49db5b5de6c)`);
        setSheepData(response.data);
      } catch (error) {
        console.error('Error fetching sheep data:', error);
        
      }
    };

    fetchSheepData();
  }, [sheepId]); 

  if (!sheepData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page">
      <div className="sau-container">
        <h1>Sau Info</h1>
        <div className="sau-detail"><strong>Navn:</strong> {sheepData.name}</div>
        <div className="sau-detail"><strong>Fødselsdato:</strong> {sheepData.birthdate}</div>
        <div className="sau-detail"><strong>Merkenummer:</strong> {sheepData.merkeNr}</div>
        <div className="sau-detail"><strong>KlaveNr:</strong> {sheepData.klaveNr}</div>
        <div className="sau-detail"><strong>Død:</strong> {sheepData.dead ? 'Ja' : 'Nei'}</div>
        <div className="sau-detail"><strong>Far:</strong> {sheepData.father}</div>
        <div className="sau-detail"><strong>Mor:</strong> {sheepData.mother}</div>
      </div>
    </div>
  );
}

export default Sau;