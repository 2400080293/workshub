import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { workshops } from '../data/mockWorkshops';
import { usdToInr, formatINR } from '../utils/currency';

export default function Workshops() {
  const [filter, setFilter] = useState('all');
  const list = workshops.filter((w) => (filter === 'all' ? true : w.type === filter));

  return (
    <div className="page workshops">
      <h2>Workshops & Trainings</h2>
      <div className="filters">
        <label>
          <input type="radio" name="type" value="all" checked={filter === 'all'} onChange={() => setFilter('all')} /> All
        </label>
        <label>
          <input type="radio" name="type" value="workshop" checked={filter === 'workshop'} onChange={() => setFilter('workshop')} /> Workshops
        </label>
        <label>
          <input type="radio" name="type" value="training" checked={filter === 'training'} onChange={() => setFilter('training')} /> Trainings
        </label>
      </div>

      <ul className="workshop-list">
        {list.map((w) => (
          <li key={w.id} className="workshop-item">
            <h4><Link to={`/workshops/${w.id}`}>{w.title}</Link></h4>
            <div className="meta">{w.instructor} • {w.date} • {w.duration} • {w.location}</div>
            <p className="excerpt">{w.description}</p>
            <div className="actions">
              <Link to={`/workshops/${w.id}`} className="button">View</Link>
              <span className="price">{w.price === 0 ? 'Free' : formatINR(usdToInr(w.price))}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
