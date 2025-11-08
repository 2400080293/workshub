// ...existing code...
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateWorkshop.css';

export default function CreateWorkshop() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [seats, setSeats] = useState('');
  const [instructor, setInstructor] = useState('');

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // focus first input on mount
    const el = document.querySelector('.cw-title-input');
    if (el) el.focus();
  }, []);

  function loadWorkshops() {
    try {
      const raw = localStorage.getItem('workshops');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveWorkshops(list) {
    localStorage.setItem('workshops', JSON.stringify(list));
  }

  function validateAll() {
    const e = {};
    if (!title.trim()) e.title = 'Title is required.';
    if (!date) e.date = 'Date is required.';
    if (seats && parseInt(seats, 10) <= 0) e.seats = 'Seats must be 1 or greater.';
    // optional: time format/duration checks
    return e;
  }

  function validateField(name, value) {
    switch (name) {
      case 'title':
        return value.trim() ? '' : 'Title is required.';
      case 'date':
        return value ? '' : 'Date is required.';
      case 'seats':
        return value && parseInt(value, 10) <= 0 ? 'Seats must be 1 or greater.' : '';
      default:
        return '';
    }
  }

  function handleChange(field, setter) {
    return (e) => {
      const val = e.target.value;
      setter(val);
      if (touched[field]) {
        setErrors((prev) => ({ ...prev, [field]: validateField(field, val) }));
      }
    };
  }

  function handleBlur(field) {
    return () => {
      setTouched((t) => ({ ...t, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field, getFieldValue(field)) }));
    };
  }

  function getFieldValue(field) {
    switch (field) {
      case 'title': return title;
      case 'description': return description;
      case 'date': return date;
      case 'time': return time;
      case 'duration': return duration;
      case 'seats': return seats;
      case 'instructor': return instructor;
      default: return '';
    }
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setDuration('');
    setSeats('');
    setInstructor('');
    setTouched({});
    setErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const allErrors = validateAll();
    setErrors(allErrors);
    setTouched({
      title: true,
      date: true,
      seats: true,
    });

    if (Object.keys(allErrors).length) return;

    setSaving(true);

    const newWorkshop = {
      id: `ws_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      date,
      time: time || null,
      duration: duration.trim() || null,
      seats: seats ? parseInt(seats, 10) : null,
      instructor: instructor.trim() || null,
      createdAt: new Date().toISOString(),
    };

    // simulate small delay for UX
    await new Promise((r) => setTimeout(r, 400));

    const list = loadWorkshops();
    list.unshift(newWorkshop);
    saveWorkshops(list);

    setSaving(false);
    setSaved(true);

    // keep success visible briefly then navigate
    setTimeout(() => {
      resetForm();
      setSaved(false);
      navigate('/workshops');
    }, 800);
  }

  return (
    <div className="create-page">
      <h2 className="cw-heading">Create Workshop / Training</h2>

      <div className="cw-grid">
        <form className="cw-form" onSubmit={handleSubmit} noValidate>
          <div className="cw-row">
            <label className="cw-label">
              Title *
              <input
                className="cw-input cw-title-input"
                type="text"
                value={title}
                onChange={handleChange('title', setTitle)}
                onBlur={handleBlur('title')}
                aria-invalid={!!errors.title}
              />
              {errors.title && <div className="cw-error">{errors.title}</div>}
            </label>
          </div>

          <div className="cw-row">
            <label className="cw-label">
              Description
              <textarea
                className="cw-input cw-textarea"
                value={description}
                onChange={handleChange('description', setDescription)}
                rows="4"
              />
            </label>
          </div>

          <div className="cw-row cw-row--inline">
            <label className="cw-label">
              Date *
              <input
                className="cw-input"
                type="date"
                value={date}
                onChange={handleChange('date', setDate)}
                onBlur={handleBlur('date')}
                aria-invalid={!!errors.date}
              />
              {errors.date && <div className="cw-error">{errors.date}</div>}
            </label>

            <label className="cw-label">
              Time
              <input
                className="cw-input"
                type="time"
                value={time}
                onChange={handleChange('time', setTime)}
              />
            </label>
          </div>

          <div className="cw-row cw-row--inline">
            <label className="cw-label">
              Duration
              <input
                className="cw-input"
                type="text"
                placeholder="e.g. 2 hours"
                value={duration}
                onChange={handleChange('duration', setDuration)}
              />
            </label>

            <label className="cw-label">
              Seats
              <input
                className="cw-input"
                type="number"
                min="1"
                value={seats}
                onChange={handleChange('seats', setSeats)}
                onBlur={handleBlur('seats')}
                aria-invalid={!!errors.seats}
              />
              {errors.seats && <div className="cw-error">{errors.seats}</div>}
            </label>
          </div>

          <div className="cw-row">
            <label className="cw-label">
              Instructor
              <input
                className="cw-input"
                type="text"
                value={instructor}
                onChange={handleChange('instructor', setInstructor)}
              />
            </label>
          </div>

          <div className="cw-actions">
            <button type="submit" className="cw-btn cw-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Create Workshop'}
            </button>

            <button
              type="button"
              className="cw-btn"
              onClick={() => navigate('/workshops')}
            >
              Cancel
            </button>

            <button
              type="button"
              className="cw-btn cw-btn-ghost"
              onClick={resetForm}
            >
              Reset
            </button>

            {saved && <span className="cw-success">Workshop created ✓</span>}
          </div>
        </form>

        <aside className="cw-preview">
          <h3 className="cw-preview-title">Preview</h3>
          <div className="preview-card">
            <div className="preview-head">
              <strong className="preview-title">{title || 'Untitled workshop'}</strong>
              <div className="preview-meta">
                {date ? <span>{date}</span> : <span className="muted">No date</span>}
                {time ? <span> • {time}</span> : null}
              </div>
            </div>

            <p className="preview-desc">{description || 'No description yet.'}</p>

            <div className="preview-info">
              <div><strong>Duration:</strong> {duration || '—'}</div>
              <div><strong>Seats:</strong> {seats || '—'}</div>
              <div><strong>Instructor:</strong> {instructor || '—'}</div>
            </div>
          </div>

          <div className="cw-note">
            Tip: created workshops are stored in localStorage for this browser.
          </div>
        </aside>
      </div>
    </div>
  );
}
// ...existing code...