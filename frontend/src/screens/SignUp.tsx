import { registerUser } from "../api/api_root";
import { useState } from "react";
import "../App.css";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      const user = {
        username,
        email,
        fullname,
        password,
      };
      const response = await registerUser(user);
      console.log(response);

      navigate('/sign-in');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Sign Up failed. Please contact for support.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>

      <label>
        Full Name:
        <input
          type="text"
          value={fullname}
          onChange={e => setFullname(e.target.value)}
        />
      </label>

      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </label>

      <button type="submit" disabled={loading}>
        Sign Up
      </button>

      {error && <div>Error: {error}</div>}
    </form>
  );
};

export default SignUp;