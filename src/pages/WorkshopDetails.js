import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { workshops } from '../data/mockWorkshops';
import { usdToInr, formatINR } from '../utils/currency';

export default function WorkshopDetails() {
  const { id } = useParams();
  const w = workshops.find((x) => String(x.id) === id);
  if (!w) return <div className="page details"><h2>Not found</h2></div>;

  return (
    <div className="page details">
      <h2>{w.title}</h2>
      <div className="meta">{w.instructor} • {w.date} • {w.duration}</div>
      <p>{w.description}</p>
      <ul>
        <li>Seats: {w.seats}</li>
        <li>Location: {w.location}</li>
        <li>Tags: {w.tags.join(', ')}</li>
        <li>Price: {w.price === 0 ? 'Free' : formatINR(usdToInr(w.price))}</li>
      </ul>

      <div className="actions">
        <button className="button primary" onClick={() => alert('Registered (mock)')}>
          Register
        </button>
        <Link to="/workshops" className="button">Back to list</Link>
      </div>
    </div>
  );
}
