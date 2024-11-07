import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../../server";

function ActivationPage() {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          await axios.post(`${server}/user/activation`, { activation_token });
        } catch (error) {
          setError(true);
        }
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <div className="flex items-center justify-center  min-w-full h-screen font-Poppins font-bold">
      {error ? (
        <p>Your link is expired!</p>
      ) : (
        <p>Your account has been created suceessfully!</p>
      )}
    </div>
  );
}

export default ActivationPage;
