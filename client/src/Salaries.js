import React, { useEffect, useMemo, useState } from 'react';
import './salary.css';
import { API_ENDPOINTS } from './config/api';

const parseCurrency = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const normalized = value.toString().replace(/[^0-9.-]+/g, '');
  return Number.parseFloat(normalized) || 0;
};

const formatCurrency = (value) => {
  const amount = parseCurrency(value);
  if (!amount) return '—';
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
};

const SalaryList = () => {
  const [allSalaries, setAllSalaries] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payFocus, setPayFocus] = useState('TotalPay');

  useEffect(() => {
    fetch(API_ENDPOINTS.SALARIES)
      .then((res) => res.json())
      .then((data) => {
        setAllSalaries(data);
        setSalaries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (!jobTitle.trim()) {
      window.alert('Enter a job title to search.');
      return;
    }

    setLoading(true);
    setError(null);
    fetch(`${API_ENDPOINTS.SALARIES}?job_title=${encodeURIComponent(jobTitle.trim())}`)
      .then((res) => res.json())
      .then((data) => {
        setSalaries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching data');
        setLoading(false);
      });
  };

  const handleReset = () => {
    setJobTitle('');
    setSalaries(allSalaries);
    setError(null);
  };

  const stats = useMemo(() => {
    if (!salaries.length) {
      return {
        averagePay: 0,
        averageOvertime: 0,
        highestPay: 0,
        agencies: new Set()
      };
    }

    const totals = salaries.reduce(
      (acc, salary) => {
        const totalPay = parseCurrency(salary.TotalPay);
        const overtime = parseCurrency(salary.OvertimePay);
        const benefits = parseCurrency(salary.TotalPayBenefits);

        acc.totalPay += totalPay;
        acc.overtime += overtime;
        acc.benefits += benefits;
        acc.highest = Math.max(acc.highest, totalPay);
        acc.agencies.add(salary.Agency);
        return acc;
      },
      { totalPay: 0, overtime: 0, benefits: 0, highest: 0, agencies: new Set() }
    );

    return {
      averagePay: totals.totalPay / salaries.length,
      averageOvertime: totals.overtime / salaries.length,
      averageBenefits: totals.benefits / salaries.length,
      highestPay: totals.highest,
      agencies: totals.agencies
    };
  }, [salaries]);

  return (
    <div className="salaries-page">
      <section className="salaries-hero">
        <div className="salaries-hero__content">
          <span className="salaries-badge">Live compensation intelligence</span>
          <h1>Benchmark salaries by role, agency, and expertise.</h1>
          <p>
            Instantly surface going rates across the TalentSync network. Search by job title and compare total compensation including base, overtime, and benefits.
          </p>

          <div className="salaries-search">
            <input
              type="text"
              placeholder="Search by job title (e.g. Firefighter)"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
            />
            <button type="button" onClick={handleSearch} disabled={loading}>
              {loading ? 'Fetching…' : 'Find salaries'}
            </button>
          </div>

          <dl className="salaries-hero__stats">
            <div>
              <dt>Average total pay</dt>
              <dd>{formatCurrency(stats.averagePay)}</dd>
            </div>
            <div>
              <dt>Average overtime</dt>
              <dd>{formatCurrency(stats.averageOvertime)}</dd>
            </div>
            <div>
              <dt>Top reported pay</dt>
              <dd>{formatCurrency(stats.highestPay)}</dd>
            </div>
            <div>
              <dt>Agencies tracked</dt>
              <dd>{stats.agencies.size}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="salaries-results">
        <div className="salaries-toolbar">
          <div>
            <h2>Compensation snapshots</h2>
            <p>{salaries.length} records match your criteria.</p>
          </div>
          <div className="salaries-toolbar__actions">
            <button type="button" className="salaries-reset" onClick={handleReset} disabled={!jobTitle && salaries === allSalaries}>
              Reset search
            </button>
            <div className="salaries-toggle" role="group" aria-label="Select pay focus">
            {['BasePay', 'OvertimePay', 'TotalPay', 'TotalPayBenefits'].map((option) => (
              <button
                key={option}
                type="button"
                className={payFocus === option ? 'is-active' : ''}
                onClick={() => setPayFocus(option)}
              >
                {option === 'BasePay' && 'Base pay'}
                {option === 'OvertimePay' && 'Overtime'}
                {option === 'TotalPay' && 'Total pay'}
                {option === 'TotalPayBenefits' && 'Total compensation'}
              </button>
            ))}
            </div>
          </div>
        </div>

        {loading && <p className="salaries-message">Loading compensation data…</p>}
        {error && !loading && <p className="salaries-message error">{error}</p>}

        {!loading && !error && !salaries.length ? (
          <div className="salaries-empty">
            <h3>No salary data matches this role yet</h3>
            <p>Adjust your search terms or try a related job title to discover more insights.</p>
          </div>
        ) : (
          <div className="salaries-grid" role="list">
            {salaries.map((salary) => (
              <article key={salary._id} role="listitem" className="salaries-card">
                <header>
                  <h3>{salary.JobTitle}</h3>
                  <span>{salary.EmployeeName}</span>
                </header>

                <div className="salaries-card__figure">
                  <p>{formatCurrency(salary[payFocus])}</p>
                  <span>
                    {payFocus === 'BasePay' && 'Base salary'}
                    {payFocus === 'OvertimePay' && 'Annual overtime'}
                    {payFocus === 'TotalPay' && 'Total pay reported'}
                    {payFocus === 'TotalPayBenefits' && 'Pay with benefits included'}
                  </span>
                </div>

                <dl className="salaries-card__meta">
                  <div>
                    <dt>Agency</dt>
                    <dd>{salary.Agency || '—'}</dd>
                  </div>
                  <div>
                    <dt>Base pay</dt>
                    <dd>{formatCurrency(salary.BasePay)}</dd>
                  </div>
                  <div>
                    <dt>Overtime</dt>
                    <dd>{formatCurrency(salary.OvertimePay)}</dd>
                  </div>
                  <div>
                    <dt>Other pay</dt>
                    <dd>{formatCurrency(salary.OtherPay)}</dd>
                  </div>
                  <div>
                    <dt>Total (benefits)</dt>
                    <dd>{formatCurrency(salary.TotalPayBenefits)}</dd>
                  </div>
                  <div>
                    <dt>Year</dt>
                    <dd>{salary.Year}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SalaryList;
