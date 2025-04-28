import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { signup } from "@/services/auth.service";
const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (_, formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call signup with email
      await signup(formData.email, formData.password);

      console.log("Signup form data:", formData);

      // Store only email in localStorage
      localStorage.setItem("user", JSON.stringify({ email: formData.email }));

      // Navigate to home page after successful signup
      navigate("/");
    } catch (err) {
      setError(
        err.message ||
          "Registration failed. Please try again with a different email."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create Account"
      description="Enter your details to create a new account"
      submitButtonText="Sign Up"
      alternateActionText="Already have an account? Login"
      alternateActionLink="/"
      onSubmit={handleSignup}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default Signup;
