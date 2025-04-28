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
      // Simulate API call with a timeout
      await signup(formData.username, formData.password);

      console.log("Signup form data:", formData);

      // For demo purposes, simulate successful signup
      localStorage.setItem(
        "user",
        JSON.stringify({ username: formData.username })
      );

      // Navigate to home page after successful signup
      navigate("/");
    } catch (err) {
      setError(
        err.message ||
          "Registration failed. Please try again with a different username."
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
