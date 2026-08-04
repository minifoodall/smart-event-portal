import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    }
  }

  return (
    <section className="form">
      <h1>Login</h1>
      <form onSubmit={submit}>
        <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button type="submit">Login</button>
        {err && <p className="error">{err}</p>}
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </section>
  );
}
