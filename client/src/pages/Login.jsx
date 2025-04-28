import React, { useState } from "react";
import AuthForm from "@/components/AuthForm";
import { login } from "@/services/auth.service";
import { useStore } from "@/store";
import { toast } from "sonner";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const store = useStore();
  const handleLogin = async (_, formData) => {
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      store.handleLogin(result.data.user);
      toast.success("Login successful");
    } catch (err) {
      toast.error(
        err.message || "Invalid email or password. Please try again."
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
    />
  );
};

export default Login;
