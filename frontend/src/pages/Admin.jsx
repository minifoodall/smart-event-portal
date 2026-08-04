import React, { useEffect, useState } from 'react';
import api from '../api';

const empty = { title: '', description: '', location: '', date: '', capacity: 50, category: 'general', imageUrl: '' };

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [stats, setStats] = useState(null);

  async function load() {
    const [{ data: evs }, { data: st }] = await Promise.all([api.get('/events'), api.get('/admin/stats')]);
    setEvents(evs);
    setStats(st);
  }
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    if (editing) {
      await api.put(`/events/${editing}`, form);
    } else {
      await api.post('/events', form);
    }
    setForm(empty);
    setEditing(null);
    load();
  }

  async function del(id) {
    if (!confirm('Delete event?')) return;
    await api.delete(`/events/${id}`);
    load();
  }

  function edit(ev) {
    setEditing(ev._id);
    setForm({ ...ev, date: ev.date.slice(0, 16) });
  }

  return (
    <section>
      <h1>Admin Dashboard</h1>
      {stats && (
        <div className="stats">
          <span>👥 Users: {stats.users}</span>
          <span>📅 Events: {stats.events}</span>
          <span>🎟 Bookings: {stats.bookings}</span>
        </div>
      )}
      <form className="form" onSubmit={save}>
        <h2>{editing ? 'Edit Event' : 'Add Event'}</h2>
        <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
        <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label>Location<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></label>
        <label>Date/Time<input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
        <label>Capacity<input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></label>
        <label>Category
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>general</option><option>tech</option><option>music</option><option>sports</option><option>business</option>
          </select>
        </label>
        <label>Image URL<input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
        <button type="submit">{editing ? 'Update' : 'Create'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
      </form>

      <h2>All Events</h2>
      <table className="table">
        <thead><tr><th>Title</th><th>Date</th><th>Capacity</th><th>Actions</th></tr></thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev._id}>
              <td>{ev.title}</td>
              <td>{new Date(ev.date).toLocaleString()}</td>
              <td>{ev.capacity}</td>
              <td>
                <button onClick={() => edit(ev)}>Edit</button>
                <button onClick={() => del(ev._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
