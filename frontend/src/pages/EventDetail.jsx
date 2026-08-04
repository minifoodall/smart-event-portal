import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext.jsx';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [ev, setEv] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get(`/events/${id}`).then((r) => setEv(r.data)).catch(() => setMsg('Not found'));
  }, [id]);

  async function book() {
    if (!user) return nav('/login');
    try {
      await api.post('/bookings', { eventId: id, tickets: Number(tickets) });
      setMsg('Booked!');
      const { data } = await api.get(`/events/${id}`);
      setEv(data);
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    }
  }

  if (!ev) return <p>{msg || 'Loading…'}</p>;
  return (
    <section>
      <h1>{ev.title}</h1>
      <p>📍 {ev.location}</p>
      <p>📅 {new Date(ev.date).toLocaleString()}</p>
      <p>🎟 Capacity left: {ev.capacity}</p>
      <p>{ev.description}</p>
      <div className="row">
        <input type="number" min="1" max={ev.capacity} value={tickets} onChange={(e) => setTickets(e.target.value)} />
        <button onClick={book}>Book</button>
      </div>
      {msg && <p>{msg}</p>}
    </section>
  );
}
