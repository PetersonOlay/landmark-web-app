import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || '';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: 'DevOps Engineering' });
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/signup`, form);
      setMsg({ type: 'success', text: 'Registration successful!' });
      setForm({ name: '', email: '', phone: '', course: 'DevOps Engineering' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Registration failed' });
    }
  };

  return (
    <div className="container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {msg && <div className={`message ${msg.type}`}>{msg.text}</div>}
        <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
          <option>DevOps Engineering</option>
          <option>AI & Machine Learning</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
