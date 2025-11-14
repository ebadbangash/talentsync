import React, { useEffect, useMemo, useState } from 'react';
import './company.css';
import { API_ENDPOINTS } from './config/api';

const normalizeString = (value = '') => value.toString().toLowerCase().trim();

const CompanyList = () => {
  const [directory, setDirectory] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    companyName: '',
    location: '',
    industry: '',
    fundingMin: '',
    fundingMax: ''
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch(API_ENDPOINTS.COMPANIES)
      .then((res) => res.json())
      .then((data) => {
        setDirectory(data);
        setCompanies(data);
      })
      .catch((err) => console.error('Error fetching companies:', err));
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const name = normalizeString(company.company_name);
      const country = normalizeString(company.country);
      const industryValue = normalizeString(company.Industry || company.industry);
      const funding = company.total_funding || '';
      const numericFunding = parseFloat(funding.toString().replace(/[^0-9.]/g, '')) || 0;

      const companyMatch = filters.companyName
        ? name.includes(normalizeString(filters.companyName))
        : true;

      const locationMatch = filters.location
        ? country.includes(normalizeString(filters.location))
        : true;

      const industryMatch = filters.industry
        ? industryValue.includes(normalizeString(filters.industry))
        : true;

      const minMatch = filters.fundingMin ? numericFunding >= Number(filters.fundingMin) : true;
      const maxMatch = filters.fundingMax ? numericFunding <= Number(filters.fundingMax) : true;

      return companyMatch && locationMatch && industryMatch && minMatch && maxMatch;
    });
  }, [companies, filters]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      window.alert('Enter a company name to search.');
      return;
    }

    setIsSearching(true);
    fetch(`${API_ENDPOINTS.COMPANIES}?company_name=${encodeURIComponent(searchQuery.trim())}`)
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error('Error searching companies:', err))
      .finally(() => setIsSearching(false));
  };

  const setFilter = (field, value) => {
  setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ companyName: '', location: '', industry: '', fundingMin: '', fundingMax: '' });
    setCompanies(directory);
    setSearchQuery('');
  };

  return (
    <div className="companies-page">
      <section className="companies-hero">
        <div className="companies-hero__content">
          <span className="companies-badge">Insights powered by TalentSync</span>
          <h1>Explore high-growth companies hiring top talent right now.</h1>
          <p>
            Filter by industry, funding, or region to uncover emerging startups and established leaders that align with your career goals.
          </p>

          <div className="companies-search">
            <input
              type="text"
              placeholder="Search by company name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
            />
            <button type="button" onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Searching…' : 'Search directory'}
            </button>
          </div>

          <dl className="companies-hero__stats">
            <div>
              <dt>Total companies listed</dt>
              <dd>{filteredCompanies.length}</dd>
            </div>
            <div>
              <dt>Average valuation</dt>
              <dd>
                {filteredCompanies.length
                  ? `~$${Math.round(
                      filteredCompanies.reduce((acc, company) => acc + (company.valuation || 0), 0) /
                        filteredCompanies.length /
                        1_000_000
                    )}M`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt>Hiring momentum</dt>
              <dd>{Math.max(...filteredCompanies.map((company) => company.job_openings || 0), 0)} open roles</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="companies-body">
        <aside className="companies-filter" aria-label="Filter companies">
          <div className="companies-filter__header">
            <h2>Smart filters</h2>
            <button type="button" onClick={handleClearFilters} className="companies-filter__clear">
              Clear all
            </button>
          </div>

          <div className="companies-filter__group">
            <label htmlFor="filter-company">Company name</label>
            <input
              id="filter-company"
              value={filters.companyName}
              onChange={(e) => setFilter('companyName', e.target.value)}
              placeholder="e.g. TechNova"
            />
          </div>

          <div className="companies-filter__group">
            <label htmlFor="filter-location">Operating region</label>
            <input
              id="filter-location"
              value={filters.location}
              onChange={(e) => setFilter('location', e.target.value)}
              placeholder="e.g. USA"
            />
          </div>

          <div className="companies-filter__group">
            <label htmlFor="filter-industry">Industry focus</label>
            <input
              id="filter-industry"
              value={filters.industry}
              onChange={(e) => setFilter('industry', e.target.value)}
              placeholder="e.g. HealthTech"
            />
          </div>

          <div className="companies-filter__range">
            <label>Funding raised (approx. USD millions)</label>
            <div className="companies-filter__range-inputs">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={filters.fundingMin}
                onChange={(e) => setFilter('fundingMin', e.target.value)}
              />
              <span>to</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={filters.fundingMax}
                onChange={(e) => setFilter('fundingMax', e.target.value)}
              />
            </div>
          </div>
        </aside>

        <div className="companies-grid" role="list">
          {filteredCompanies.length ? (
            filteredCompanies.map((company) => {
              const industryLabel = company.Industry || company.industry || '—';
              return (
                <article key={company._id} role="listitem" className="companies-card">
                  <header>
                    <h3>{company.company_name}</h3>
                    <span className="companies-card__industry">{industryLabel}</span>
                  </header>
                  <dl>
                    <div>
                      <dt>Location</dt>
                      <dd>{company.city ? `${company.city}, ${company.country}` : company.country || '—'}</dd>
                    </div>
                    <div>
                      <dt>Headcount</dt>
                      <dd>{company.employees ? `${company.employees.toLocaleString()} employees` : '—'}</dd>
                    </div>
                    <div>
                      <dt>Job openings</dt>
                      <dd>{company.job_openings || 0}</dd>
                    </div>
                    <div>
                      <dt>Valuation</dt>
                      <dd>
                        {company.valuation ? `$${(company.valuation / 1_000_000).toFixed(1)}M` : '—'}
                      </dd>
                    </div>
                    <div>
                      <dt>Total funding</dt>
                      <dd>{company.total_funding || '—'}</dd>
                    </div>
                  </dl>
                  <footer>
                    <a href={company.linkedin_url} target="_blank" rel="noreferrer">
                      View on LinkedIn
                    </a>
                    <a href={company.product_url} target="_blank" rel="noreferrer">
                      Visit website
                    </a>
                  </footer>
                </article>
              );
            })
          ) : (
            <div className="companies-empty">
              <h3>No companies match your filters</h3>
              <p>Try broadening your search terms or clearing filters to explore more organizations.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CompanyList;
