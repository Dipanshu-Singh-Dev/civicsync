import React, { useState } from "react";
import AuthForm from "@/components/AuthForm";
import { login } from "@/services/auth.service";
import { useStore } from "@/store";
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const store = useStore();
  const handleLogin = async (_, formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call with a timeout
      await login(formData.username, formData.password);
      store.handleLogin(formData);
    } catch (err) {
      setError(
        err.message || "Invalid username or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Login"
      description="Enter your credentials to access your account"
      submitButtonText="Login"
      alternateActionText="Don't have an account? Sign up"
      alternateActionLink="/signup"
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default Login;
