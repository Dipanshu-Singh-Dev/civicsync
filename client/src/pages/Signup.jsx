import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { signup } from "@/services/auth.service";
import { useStore } from "@/store";
import { toast } from "sonner";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const store = useStore();

  const handleSignup = async (_, formData) => {
    setIsLoading(true);

    try {
      // Call signup with email
      const result = await signup(formData.email, formData.password);

      // Save user with token
      const userData = {
        ...result.data.user,
        token: result.data.token
      };
      store.handleLogin(userData);

      toast.success("Account created successfully");
      // Navigate to home page after successful signup
      navigate("/");
    } catch (err) {
      toast.error(
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
    />
  );
};

export default Signup;
