import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateWorkshop.css';

export default function MyRegistrations() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const loadJSON = (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const saveJSON = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // sample workshops (guaranteed ids)
  const SAMPLE_WORKSHOPS = [
    {
      id: 'ws_sample_1',
      title: 'Frontend Mastery: React.js Bootcamp',
      description:
        'Learn to build dynamic, modern web apps using React, hooks, and state management. Hands-on labs and project-based learning.',
      date: '2025-11-15',
      time: '10:00',
      duration: '3 hours',
      seats: 40,
      instructor: 'Priya Mehta',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ws_sample_2',
      title: 'Node.js & Express: Building REST APIs',
      description:
        'Hands-on workshop on designing and developing scalable backend APIs using Node.js and Express. Includes testing and deployment tips.',
      date: '2025-11-22',
      time: '14:00',
      duration: '4 hours',
      seats: 35,
      instructor: 'Arjun Sharma',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ws_sample_3',
      title: 'UI/UX Essentials for Developers',
      description:
        'Practical design patterns, color theory, and wireframing to help developers deliver delightful user experiences.',
      date: '2025-11-29',
      time: '09:30',
      duration: '2.5 hours',
      seats: 25,
      instructor: 'Sneha Reddy',
      createdAt: new Date().toISOString(),
    },
  ];

  // Ensure sample workshops/registrations exist and merge with existing ones (avoid overwriting custom data)
  const seedSampleData = () => {
    const existingWorkshops = loadJSON('workshops') || [];
    const existingRegistrations = loadJSON('registrations') || [];

    // Add any missing sample workshops by id
    const existingIds = new Set(existingWorkshops.map((w) => w.id));
    const mergedWorkshops = [...existingWorkshops];
    SAMPLE_WORKSHOPS.forEach((s) => {
      if (!existingIds.has(s.id)) mergedWorkshops.push(s);
    });

    // If no registrations exist, add a couple of realistic registrations
    const mergedRegistrations = existingRegistrations.length
      ? existingRegistrations
      : [
          {
            id: 'reg_1',
            workshopId: 'ws_sample_1',
            userEmail: 'user@example.com',
            registeredAt: new Date().toISOString(),
          },
          {
            id: 'reg_2',
            workshopId: 'ws_sample_2',
            userEmail: 'admin@example.com',
            registeredAt: new Date().toISOString(),
          },
        ];

    saveJSON('workshops', mergedWorkshops);
    saveJSON('registrations', mergedRegistrations);

    return { ws: mergedWorkshops, regs: mergedRegistrations };
  };

  useEffect(() => {
    const u = loadJSON('user');
    setUser(u);

    const { ws, regs } = seedSampleData();
    setWorkshops(ws);
    setRegistrations(regs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setWorkshops(loadJSON('workshops') || []);
      setRegistrations(loadJSON('registrations') || []);
      setUser(loadJSON('user'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveRegs = (next) => {
    setRegistrations(next);
    saveJSON('registrations', next);
  };

  const handleCancel = (regId) => {
    if (!window.confirm('Cancel this registration?')) return;
    saveRegs(registrations.filter((r) => r.id !== regId));
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleDemoUser = () => {
    const demo = { email: 'user@example.com', name: 'Sample User', role: 'user' };
    localStorage.setItem('user', JSON.stringify(demo));
    setUser(demo);
  };

  // helper: count registrations per workshop (hook called unconditionally)
  const regsByWorkshop = useMemo(() => {
    const m = {};
    (registrations || []).forEach((r) => {
      m[r.workshopId] = (m[r.workshopId] || 0) + 1;
    });
    return m;
  }, [registrations]);

  // visible registrations: admin sees all, user sees only theirs (hook called unconditionally)
  const visible = useMemo(
    () => (user && user.role === 'admin' ? registrations : registrations.filter((r) => user && r.userEmail === user.email)),
    [registrations, user]
  );

  const list = useMemo(
    () =>
      (visible || []).map((r) => {
        const w = workshops.find((x) => x.id === r.workshopId);
        if (w) {
          const seats = Number.isFinite(Number(w.seats)) ? w.seats : null;
          const taken = regsByWorkshop[w.id] || 0;
          const seatsRemaining = seats !== null ? Math.max(0, seats - taken) : null;
          return { ...r, workshop: w, seatsRemaining };
        }
        // fallback: try to show something realistic if workshop missing
        return {
          ...r,
          workshop: {
            id: r.workshopId,
            title: 'Removed workshop',
            description: 'This workshop was removed from the list.',
            date: '',
            time: '',
            duration: '',
            seats: null,
            instructor: '',
          },
          seatsRemaining: null,
        };
      }),
    [visible, workshops, regsByWorkshop]
  );

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return 'TBD';
    try {
      const iso = `${dateStr}T${timeStr || '00:00'}`;
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: timeStr ? 'numeric' : undefined,
        minute: timeStr ? '2-digit' : undefined,
      });
    } catch {
      return dateStr + (timeStr ? ` ${timeStr}` : '');
    }
  };

  const snippet = (text, len = 120) => (text && text.length > len ? `${text.slice(0, len).trim()}…` : text || '');

  if (!user) {
    return (
      <div className="create-page" style={{ maxWidth: 760 }}>
        <h2 className="cw-heading">My Registrations</h2>
        <div className="cw-form">
          <p>Please sign in to see your registrations.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="cw-btn cw-btn-primary" onClick={() => navigate('/login')}>
              Go to Login
            </button>
            <button className="cw-btn" onClick={handleDemoUser}>
              Continue as Demo User
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-page">
      <h2 className="cw-heading">My Registrations</h2>

      <div className="cw-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="cw-form">
          {list.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No registrations found. Browse workshops to register.</p>
          ) : (
            list.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: 12,
                  borderBottom: '1px solid #eef2ff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{r.workshop.title}</div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>
                      {formatDateTime(r.workshop.date, r.workshop.time)}
                    </div>
                  </div>

                  <div style={{ color: '#374151', fontSize: 13, marginTop: 6 }}>{snippet(r.workshop.description, 160)}</div>

                  <div style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center', color: '#374151', fontSize: 13 }}>
                    <div>
                      <strong>Instructor:</strong> {r.workshop.instructor || '—'}
                    </div>
                    <div>
                      <strong>Duration:</strong> {r.workshop.duration || '—'}
                    </div>
                    <div>
                      <strong>Seats:</strong>{' '}
                      {r.seatsRemaining === null ? (r.workshop.seats || '—') : `${r.seatsRemaining} left`}
                    </div>
                  </div>

                  <div style={{ marginTop: 8, color: '#6b7280', fontSize: 13 }}>
                    Registered by: <strong>{r.userEmail}</strong> • {new Date(r.registeredAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <button
                    className="cw-btn"
                    onClick={() => (r.workshop.id && r.workshop.id.startsWith('ws_') ? navigate(`/workshops/${r.workshop.id}`) : navigate('/workshops'))}
                  >
                    View Workshop
                  </button>

                  {r.workshop.instructor ? (
                    <button
                      className="cw-btn"
                      onClick={() => {
                        window.location.href = `mailto:${r.workshop.instructor.replace(/\s+/g, '.').toLowerCase()}@example.com?subject=Question about ${encodeURIComponent(
                          r.workshop.title
                        )}`;
                      }}
                    >
                      Contact Instructor
                    </button>
                  ) : (
                    <div style={{ height: 36 }} />
                  )}

                  <button className="cw-btn" onClick={() => handleCancel(r.id)}>
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}

          <div style={{ marginTop: 12 }}>
            <button className="cw-btn" onClick={() => navigate('/workshops')}>
              Browse Workshops
            </button>
            <button
              className="cw-btn cw-btn-ghost"
              onClick={handleSignOut}
              style={{ marginLeft: 8 }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
