import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Your CSS file

export default function Login() {
  const [username, setUsername] = useState(''); // Change 'email' to 'username' for clarity
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Send username & password in body
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Invalid username or password');
      }

      if (data.message || data.profile) {
        localStorage.setItem('username', username); // Store username in localStorage
        // Login success
        navigate('/home');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              id="username"
              name="username"
              autoComplete="username"
              required
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <div>
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
