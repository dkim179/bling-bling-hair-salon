import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        "admin-login",
        {
          body: {
            username: username.trim(),
            password,
          },
        },
      );

      if (functionError) {
        throw functionError;
      }

      if (!data?.access_token || !data?.refresh_token) {
        throw new Error(data?.error || "Unable to sign in.");
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (sessionError) {
        throw sessionError;
      }

      window.location.href = "/admin";
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="adminLoginPage">
      <section className="adminLoginCard">
        <div className="adminLoginBrand">
          <span>BLING BLING</span>
          <small>HAIR SALON</small>
        </div>

        <div className="adminLoginHeading">
          <p className="adminEyebrow">ADMIN</p>
          <h1>Welcome back.</h1>
          <p>Sign in to manage your appointments.</p>
        </div>

        <form className="adminLoginForm" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="adminLoginError" role="alert">
              {error}
            </p>
          )}

          <button
            className="adminLoginButton"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
