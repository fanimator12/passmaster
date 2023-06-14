import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);

      navigate('/auth', { state: { username, password } });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Sign In failed. Please contact for support.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <input type="submit" value="Sign In" disabled={loading} />
      </form>
    </div>
  );
};

export default SignIn;
