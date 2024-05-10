//Alador
/**
 * denne logikken er brukt av profil.js filen til å vise brukerens fornavn og etternavn ved å dekode det innkommende token og trekke ut relevant informasjon
 */
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
  });
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserDetails({
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
        });
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUserDetails({ firstName: "", lastName: "" }); // Tilbakestill brukerdetaljer hvis token er ugyldig
      }
    } else {
      // Tilbakestill eventuelt brukerdetaljer hvis det ikke er noe token
      setUserDetails({ firstName: "", lastName: "" });
    }
  }, [token]); // Avhenger av token

  return userDetails;
};

export default useUserDetails;
