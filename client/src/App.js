import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import JobList from './JobList';
import Companies from './Companies';
import SalaryList from './Salaries';
import ApplyForJob from './JobApply';
import Login from './login';
import Signup from './signup';
import './App.css';

const navLinkClass = ({ isActive }) =>
  isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link';

const App = () => (
  <Router>
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/jobs" className="app-brand" aria-label="TalentSync home">
            <span className="app-brand__logo">TS</span>
            <span className="app-brand__text">TalentSync</span>
          </NavLink>

          <nav className="app-nav" aria-label="Primary navigation">
            <NavLink to="/jobs" className={navLinkClass} end>
              Jobs
            </NavLink>
            <NavLink to="/companies" className={navLinkClass}>
              Companies
            </NavLink>
            <NavLink to="/salaries" className={navLinkClass}>
              Salaries
            </NavLink>
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className="app-nav__cta">
              Join for free
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/salaries" element={<SalaryList />} />
          <Route path="/jobs/apply" element={<ApplyForJob />} />
          <Route path="/job/apply" element={<ApplyForJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="app-footer__inner">
          <p>© {new Date().getFullYear()} TalentSync. Empowering careers with data-driven insights.</p>
          <div className="app-footer__links">
            <a href="mailto:support@talentsync.dev">Support</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://www.twitter.com" target="_blank" rel="noreferrer">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  </Router>
);

export default App;
