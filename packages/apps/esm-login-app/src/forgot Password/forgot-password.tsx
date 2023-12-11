import React, { useState } from "react";
import { TextInput, Button } from "@carbon/react";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setErrorMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async () => {
    // Implement logic to handle the forgot password functionality
    // This could involve sending a reset password email, forexample
    // Include error handling and update the state accordinglj
  };

  // Add a function to handle navigation back to the login page
  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <p>Enter your email to reset your password.</p>
      <TextInput
        labelText="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleForgotPassword}>Reset Password</Button>
      {/* Add a button or link to navigate back to the login page */}
      <Button kind="secondary" onClick={goToLogin}>
        Back to Login
      </Button>
    </div>
  );
};

export default ForgotPassword;
