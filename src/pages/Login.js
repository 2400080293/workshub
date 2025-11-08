import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateWorkshop.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mock credentials
  const creds = [
    { email: 'admin@example.com', password: 'admin123', name: 'Admin', role: 'admin' },
    { email: 'user@example.com', password: 'user123', name: 'Sample User', role: 'user' },
  ];

  function persistUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const found = creds.find(
      (c) => c.email === (email || '').trim().toLowerCase() && c.password === password
    );
    if (!found) {
      setError('Invalid credentials. Try admin@example.com / admin123 or user@example.com / user123');
      return;
    }
    persistUser({ email: found.email, name: found.name, role: found.role });
    navigate('/my-registrations');
  }

  return (
    <div className="create-page" style={{ maxWidth: 560 }}>
      <h2 className="cw-heading">Mock Login</h2>

      <form className="cw-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="cw-error" style={{ marginBottom: 12 }}>{error}</div>}

        <div className="cw-row">
          <label className="cw-label">
            Email
            <input
              className="cw-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </label>
        </div>

        <div className="cw-row">
          <label className="cw-label">
            Password
            <input
              className="cw-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="admin123"
            />
          </label>
        </div>

        <div className="cw-actions">
          <button type="submit" className="cw-btn cw-btn-primary">Sign in</button>
          <button
            type="button"
            className="cw-btn cw-btn-ghost"
            onClick={() => {
              setEmail('admin@example.com');
              setPassword('admin123');
            }}
          >
            Fill admin
          </button>
        </div>

        <div style={{ marginTop: 12, color: '#6b7280', fontSize: 13 }}>
          Demo credentials: admin@example.com / admin123 (admin) — user@example.com / user123 (user)
        </div>
      </form>
    </div>
  );
}
