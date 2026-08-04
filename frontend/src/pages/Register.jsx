import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    }
  }

  return (
    <section className="form">
      <h1>Create account</h1>
      <form onSubmit={submit}>
        <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password (min 6)<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button type="submit">Register</button>
        {err && <p className="error">{err}</p>}
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </section>
  );
}
