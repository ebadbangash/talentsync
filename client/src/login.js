import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { API_ENDPOINTS } from './config/api';

const initialFormState = {
    email: '',
    password: ''
};

const Login = () => {
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
        setMessageType('info');

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            });

            const data = await response.json();

            if (!response.ok || !data.token) {
                throw new Error(data.message || 'Unable to sign in. Check your credentials and try again.');
            }

            localStorage.setItem('token', data.token);
            setMessageType('success');
            setMessage('Welcome back! Redirecting to your dashboard…');

            setTimeout(() => {
                navigate('/jobs');
            }, 1200);
        } catch (error) {
            setMessageType('error');
            setMessage(error.message || 'Error logging in');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignupRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <section className="auth-illustration">
                    <div className="auth-brand">
                        <span className="auth-badge">TalentSync</span>
                        <h1>Move your career forward.</h1>
                        <p>
                            Access personalised job matches, salary insights, and company trends in a single, intuitive workspace.
                        </p>
                    </div>

                    <ul className="auth-highlights">
                        <li>⚡ Curated roles aligned with your skills</li>
                        <li>📊 Real-time salary benchmarks</li>
                        <li>🤝 Direct connections with hiring managers</li>
                    </ul>

                    <div className="auth-cta">
                        <span>New to TalentSync?</span>
                        <button type="button" onClick={handleSignupRedirect} className="auth-secondary-button">
                            Create a free account
                        </button>
                    </div>
                </section>

                <section className="auth-form" aria-labelledby="login-heading">
                    <div className="auth-form__header">
                        <h2 id="login-heading">Welcome back</h2>
                        <p>Sign in to continue tracking applications and discover your next opportunity.</p>
                    </div>

                                <form onSubmit={handleSubmit} className="auth-form__body">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            value={formValues.email}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            value={formValues.password}
                            onChange={handleChange}
                            required
                        />

                        <div className="auth-form__meta">
                            <label className="auth-remember">
                                <input type="checkbox" name="remember" disabled />
                                Remember me (coming soon)
                            </label>
                            <button type="button" className="auth-link" disabled>
                                Forgot password?
                            </button>
                        </div>

                        <button type="submit" className="auth-primary-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                                <p className="auth-inline-action">
                                    Don&apos;t have an account?{' '}
                                    <button type="button" className="auth-link" onClick={handleSignupRedirect}>
                                        Sign up for free
                                    </button>
                                </p>

                    {message && (
                        <div className={`auth-feedback auth-feedback--${messageType}`} role="status" aria-live="polite">
                            {message}
                        </div>
                    )}

                    <div className="auth-footer">
                        <span>Need help?</span>
                        <a className="auth-link" href="mailto:support@talentsync.dev">
                            Contact support
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;
