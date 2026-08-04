import React, { useEffect, useState } from 'react';
import api from '../api';

export default function MyBookings() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/bookings/my').then((r) => setItems(r.data));
  }, []);

  async function cancel(id) {
    await api.delete(`/bookings/${id}`);
    setItems((arr) => arr.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b)));
  }

  return (
    <section>
      <h1>My Bookings</h1>
      {items.length === 0 && <p>No bookings yet.</p>}
      <ul className="bookings">
        {items.map((b) => (
          <li key={b._id} className={b.status === 'cancelled' ? 'cancelled' : ''}>
            <strong>{b.event?.title || 'Event'}</strong> — {b.tickets} ticket(s) — <em>{b.status}</em>
            {b.status === 'confirmed' && (
              <button onClick={() => cancel(b._id)}>Cancel</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
