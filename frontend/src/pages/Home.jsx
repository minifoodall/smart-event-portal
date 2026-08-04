import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

// Home page lists events and includes the v3 event search/filter feature
export default function Home() {
  const [events, setEvents] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (q) params.q = q;
      if (category) params.category = category;
      const { data } = await api.get('/events', { params });
      setEvents(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [q, category]);

  return (
    <section>
      <h1>Upcoming Events</h1>
      <div className="toolbar">
        <input
          placeholder="🔎 Search by title, description, location…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="tech">Tech</option>
          <option value="music">Music</option>
          <option value="sports">Sports</option>
          <option value="business">Business</option>
          <option value="general">General</option>
        </select>
      </div>
      {loading && <p>Loading…</p>}
      {error && <p className="error">Error: {error}</p>}
      <div className="grid">
        {events.map((ev) => (
          <Link key={ev._id} to={`/events/${ev._id}`} className="card">
            <h3>{ev.title}</h3>
            <p className="muted">📍 {ev.location}</p>
            <p>📅 {new Date(ev.date).toLocaleString()}</p>
            <p>🎟 Capacity: {ev.capacity}</p>
            {ev.category && <span className="badge">{ev.category}</span>}
          </Link>
        ))}
        {!loading && events.length === 0 && <p>No events match your search.</p>}
      </div>
    </section>
  );
}
