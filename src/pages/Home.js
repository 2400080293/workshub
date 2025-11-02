import React from 'react';
import { Link } from 'react-router-dom';
import { workshops } from '../data/mockWorkshops';

export default function Home() {
  const featured = workshops.slice(0, 3);
  return (
    <div className="page home">
      <section className="hero">
        <h2>Start Learning — Online Workshops & Trainings</h2>
        <p>Discover upcoming workshops and short trainings. No sign-in required to browse.</p>
        <p>
          <Link to="/workshops" className="cta">Browse all workshops</Link>
        </p>
      </section>

      <section className="featured">
        <h3>Featured</h3>
        <ul>
          {featured.map((w) => (
            <li key={w.id}>
              <Link to={`/workshops/${w.id}`}>{w.title}</Link> — {w.instructor} — {w.date}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
