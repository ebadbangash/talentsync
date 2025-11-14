import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './jobList.css';
import { API_ENDPOINTS } from './config/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchJob, setSearchJob] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch(API_ENDPOINTS.JOBS)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setSelectedJob(data[0] || null);
      })
      .catch((err) => console.error(err));
  }, []);

  const navigate = useNavigate();

  const handleApply = () => {
    if (!selectedJob) return;
    navigate('/job/apply', { state: { jobId: selectedJob._id } });
  };

  const executeSearch = () => {
    setIsSearching(true);
    const params = new URLSearchParams();

    if (searchJob) params.append('job_name', searchJob);
    if (searchLocation) params.append('location', searchLocation);

    fetch(`${API_ENDPOINTS.JOBS}?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setSelectedJob(data[0] || null);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsSearching(false));
  };

  const handleSearch = () => {
    if (!searchJob && !searchLocation) {
      window.alert('Please enter a job title or location to search.');
      return;
    }
    executeSearch();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="jobs-page">
      <section className="jobs-hero">
        <div className="jobs-hero__content">
          <span className="jobs-hero__badge">Discover curated roles</span>
          <h1>Find the role that moves your career forward.</h1>
          <p>
            Search thousands of openings from innovative companies, compare compensation instantly, and apply with confidence.
          </p>

          <div className="jobs-search" onKeyDown={handleKeyPress}>
            <div className="jobs-search__field">
              <label htmlFor="job-keyword">Job title or keyword</label>
              <input
                id="job-keyword"
                type="text"
                placeholder="e.g. Product Designer"
                value={searchJob}
                onChange={(e) => setSearchJob(e.target.value)}
              />
            </div>

            <div className="jobs-search__field">
              <label htmlFor="job-location">Location</label>
              <input
                id="job-location"
                type="text"
                placeholder="Remote or city"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>

            <button type="button" className="jobs-search__button" onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Searching…' : 'Search jobs'}
            </button>
          </div>

          <div className="jobs-hero__stats">
            <div>
              <strong>{jobs.length}</strong>
              <span>open roles</span>
            </div>
            <div>
              <strong>4.7★</strong>
              <span>average employer rating</span>
            </div>
            <div>
              <strong>2.4x</strong>
              <span>faster application turnaround</span>
            </div>
          </div>
        </div>
      </section>

      <section className="jobs-body">
        <div className="jobs-list" role="list">
          {jobs.length === 0 && !isSearching ? (
            <div className="jobs-empty">
              <h3>No openings found.</h3>
              <p>Try adjusting your filters or explore trending roles to keep the momentum going.</p>
            </div>
          ) : (
            jobs.map((job) => {
              const isActive = selectedJob?._id === job._id;
              return (
                <article
                  key={job._id}
                  role="listitem"
                  tabIndex={0}
                  className={`jobs-card${isActive ? ' jobs-card--active' : ''}`}
                  onClick={() => setSelectedJob(job)}
                  onKeyPress={(event) => event.key === 'Enter' && setSelectedJob(job)}
                >
                  <header>
                    <span className="jobs-card__company">{job['Company Name']}</span>
                    <h3>{job['Job Title']}</h3>
                  </header>
                  <footer>
                    <span>{job['Salary Estimate'] || 'Salary confidential'}</span>
                    <span>{job.Location}</span>
                    <span className={`jobs-card__pill${job['Easy Apply'] ? ' jobs-card__pill--positive' : ''}`}>
                      {job['Easy Apply'] ? 'Easy apply' : 'Standard apply'}
                    </span>
                  </footer>
                </article>
              );
            })
          )}
        </div>

        <aside className="jobs-details">
          {selectedJob ? (
            <div className="jobs-details__content">
              <div className="jobs-details__header">
                <span className="jobs-details__company">{selectedJob['Company Name']}</span>
                <h2>{selectedJob['Job Title']}</h2>
                <p>{selectedJob['Salary Estimate']}</p>
              </div>

              <dl className="jobs-details__meta">
                <div>
                  <dt>Location</dt>
                  <dd>{selectedJob.Location}</dd>
                </div>
                <div>
                  <dt>Industry</dt>
                  <dd>{selectedJob.Industry || '—'}</dd>
                </div>
                <div>
                  <dt>Founded</dt>
                  <dd>{selectedJob.Founded || '—'}</dd>
                </div>
                <div>
                  <dt>Company size</dt>
                  <dd>{selectedJob.Size || '—'}</dd>
                </div>
                <div>
                  <dt>Rating</dt>
                  <dd>{selectedJob.Rating || '—'}</dd>
                </div>
              </dl>

              <section className="jobs-details__description">
                <h3>About the role</h3>
                <p>{selectedJob['Job Description']}</p>
              </section>

              <button type="button" className="jobs-details__cta" onClick={handleApply}>
                Apply now
              </button>
            </div>
          ) : (
            <div className="jobs-details__placeholder">
              <h3>Select a role to see more</h3>
              <p>Browse the openings on the left to preview responsibilities, benefits, and company insights.</p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
};

export default JobList;
