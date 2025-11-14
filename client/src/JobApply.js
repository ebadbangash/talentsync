import { useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import './apply.css';
import { API_ENDPOINTS } from './config/api';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\s-]{7,}$/;

const ApplyForJob = () => {
  const location = useLocation();
  const jobId = location.state?.jobId;

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [date, setDate] = useState('');
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLeter] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resumeInputRef = useRef(null);

  const validateForm = () => {
    const validationErrors = {};

    if (!jobId) {
      validationErrors.job = 'No job reference was provided. Please return to the job listing and try again.';
    }

    if (!fname.trim()) {
      validationErrors.firstName = 'First name is required.';
    }

    if (!lname.trim()) {
      validationErrors.lastName = 'Last name is required.';
    }

    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!emailPattern.test(email.trim())) {
      validationErrors.email = 'Enter a valid email address.';
    }

    if (!phone.trim()) {
      validationErrors.phone = 'Phone number is required.';
    } else if (!phonePattern.test(phone.trim())) {
      validationErrors.phone = 'Enter a valid phone number.';
    }

    if (!position.trim()) {
      validationErrors.position = 'Please specify the position you are applying for.';
    }

    if (!coverLetter.trim()) {
      validationErrors.coverLetter = 'Cover letter is required to highlight your experience.';
    }

    if (!resume) {
      validationErrors.resume = 'Attach your resume before submitting.';
    }

    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('job_id', jobId || '');
    formData.append('firstName', fname.trim());
    formData.append('lastName', lname.trim());
    formData.append('email', email.trim());
    formData.append('phone', phone.trim());
    formData.append('positionApplied', position.trim());
    formData.append('interviewDate', date);
    formData.append('resume', resume);
    formData.append('coverLetter', coverLetter.trim());

    fetch(API_ENDPOINTS.JOB_APPLY, {
      method: 'POST',
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.message || 'Unable to submit application.');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Application submitted:', data);
        alert('Application successfully submitted!');

        setFname('');
        setLname('');
        setEmail('');
        setPhone('');
        setPosition('');
        setDate('');
        setResume(null);
        setCoverLeter('');
        if (resumeInputRef.current) {
          resumeInputRef.current.value = '';
        }
      })
      .catch((err) => {
        console.error('Error applying for the job:', err);
        alert(err.message || 'Error submitting application. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit} noValidate>
      <div className="firstPortion">
        <div>
          <label id="first">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="John"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
          />
          {errors.firstName && <p className="form-error">{errors.firstName}</p>}
        </div>
        <div>
          <label id="last">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Doe"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
          />
          {errors.lastName && <p className="form-error">{errors.lastName}</p>}
        </div>
        <div>
          <label id="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="john12@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        <div>
          <label id="phone">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="(555) 012-3456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>
        <div>
          <label id="position">Position Applied</label>
          <input
            type="text"
            name="position"
            placeholder="Software Engineer"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          {errors.position && <p className="form-error">{errors.position}</p>}
        </div>
        <div>
          <label id="date">Preferred Interview Date</label>
          <input
            type="date"
            name="interviewDate"
            placeholder="MM-DD-YY"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <div className="secondPortion">
        <div>
          <label id="cover">Cover Letter</label>
          <textarea
            name="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLeter(e.target.value)}
          />
          {errors.coverLetter && <p className="form-error">{errors.coverLetter}</p>}
        </div>
        <div>
          <label id="res">Resume</label>
          <input
            id="resume"
            name="resume"
            ref={resumeInputRef}
            type="file"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setResume(e.target.files[0] || null)}
          />
          {errors.resume && <p className="form-error">{errors.resume}</p>}
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Apply'}
          </button>
        </div>
      </div>
      {errors.job && <p className="form-error form-error--global">{errors.job}</p>}
    </form>
  );
};

export default ApplyForJob;
