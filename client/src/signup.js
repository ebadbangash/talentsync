import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import './signup.css';
import { API_ENDPOINTS } from './config/api';

const initialFormState = {
  username: '',
  email: '',
  password: ''
};

const Signup = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign up at the moment.');
      }

      setMessageType('success');
      setMessage('Account created! Redirecting you to sign in…');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setMessageType('error');
      setMessage(error.message || 'Error registering user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="auth-page signup-page">
      <div className="auth-card signup-card">
        <section className="auth-form" aria-labelledby="signup-heading">
          <div className="auth-form__header">
            <h2 id="signup-heading">Create your TalentSync account</h2>
            <p>Track applications, compare salaries, and apply to curated roles in minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form__body">
            <label htmlFor="username">Name</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              value={formValues.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formValues.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder="Create a secure password"
              autoComplete="new-password"
              value={formValues.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="auth-primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {message && (
            <div className={`auth-feedback auth-feedback--${messageType}`} role="status" aria-live="polite">
              {message}
            </div>
          )}

          <p className="auth-inline-action">
            Already have an account?{' '}
            <button type="button" className="auth-link" onClick={handleLoginRedirect}>
              Sign in instead
            </button>
          </p>
        </section>

        <section className="signup-illustration">
          <div className="signup-illustration__content">
            <span className="auth-badge">Why join TalentSync?</span>
            <h3>Stay ahead at every career milestone.</h3>
            <ul>
              <li>🔥 Smart alerts for roles that match your interests.</li>
              <li>📈 Salary trendlines that help negotiate your worth.</li>
              <li>🤖 AI-powered resume feedback before you apply.</li>
            </ul>

            <div className="signup-illustration__footer">
              <p>Join thousands of professionals accelerating their job search with TalentSync.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Signup;