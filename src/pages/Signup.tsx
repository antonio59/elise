import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthFormFields from "../components/auth/AuthFormFields";
import { useAuth } from "../contexts/AuthContext";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import AuthFormLayout from "../components/auth/AuthFormLayout";

const Signup: React.FC = () => {
  usePageAnnouncement("Signup");
  usePageMeta({ title: "Sign up", description: "Create an account" });
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp(email, password, name);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create account";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Create Account"
      subtitle="Start your reading adventure!"
      error={error}
      loading={loading}
      submitLabel="Create Account"
      loadingLabel="Creating account..."
      onSubmit={handleSubmit}
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </>
      }
    >
      <AuthFormFields
        name={name}
        onNameChange={setName}
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
      />
    </AuthFormLayout>
  );
};

export default Signup;
