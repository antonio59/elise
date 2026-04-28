import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthFormFields from "../components/auth/AuthFormFields";
import { useAuth } from "../contexts/AuthContext";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import AuthFormLayout from "../components/auth/AuthFormLayout";

const Login: React.FC = () => {
  usePageAnnouncement("Login");
  usePageMeta({ title: "Login", description: "Sign in to Elise Reads" });
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to sign in";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Welcome Back!"
      subtitle="Sign in to continue your adventure"
      error={error}
      loading={loading}
      submitLabel="Sign In"
      loadingLabel="Signing in..."
      onSubmit={handleSubmit}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign up
          </Link>
        </>
      }
    >
      <AuthFormFields
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
      />
    </AuthFormLayout>
  );
};

export default Login;
