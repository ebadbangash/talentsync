const users = [
  {
    username: 'admin',
    email: 'admin@talentsync.dev',
    password: 'Admin@123',
    role: 'admin'
  },
  {
    username: 'jane_doe',
    email: 'jane.doe@talentsync.dev',
    password: 'Password123',
    role: 'user'
  },
  {
    username: 'employer_portal',
    email: 'employer@talentsync.dev',
    password: 'Employer123',
    role: 'admin'
  }
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const companyTemplates = [
  {
    company_name: 'TechNova Labs',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    employees: 320,
    founded: 2018,
    Industry: 'Software',
    GrowjoRanking: 405,
    PreviousRanking: 470,
    estimated_revenues: 18000000,
    job_openings: 14,
    keywords: 'SaaS, Analytics, AI',
    LeadInvestors: 'Sequoia Capital',
    btype: 'Private',
    valuation: 95000000,
    total_funding: '$42M',
    growth_percentage: '22%'
  },
  {
    company_name: 'GreenGrid Energy',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    employees: 125,
    founded: 2015,
    Industry: 'CleanTech',
    GrowjoRanking: 1120,
    PreviousRanking: 1350,
    estimated_revenues: 7200000,
    job_openings: 9,
    keywords: 'Renewable, Solar, Battery',
    LeadInvestors: 'Accel',
    btype: 'Private',
    valuation: 33000000,
    total_funding: '$14M',
    growth_percentage: '17%'
  },
  {
    company_name: 'CareLink Health',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    employees: 540,
    founded: 2012,
    Industry: 'HealthTech',
    GrowjoRanking: 890,
    PreviousRanking: 905,
    estimated_revenues: 24600000,
    job_openings: 21,
    keywords: 'Telemedicine, Remote Care, Healthcare',
    LeadInvestors: 'Andreessen Horowitz',
    btype: 'Private',
    valuation: 120000000,
    total_funding: '$58M',
    growth_percentage: '19%'
  },
  {
    company_name: 'SkyBridge Logistics',
    city: 'Denver',
    state: 'CO',
    country: 'USA',
    employees: 210,
    founded: 2016,
    Industry: 'Logistics',
    GrowjoRanking: 1350,
    PreviousRanking: 1425,
    estimated_revenues: 9800000,
    job_openings: 12,
    keywords: 'Supply Chain, Automation, SaaS',
    LeadInvestors: 'Bessemer Venture Partners',
    btype: 'Private',
    valuation: 58000000,
    total_funding: '$27M',
    growth_percentage: '18%'
  },
  {
    company_name: 'AquaSense Analytics',
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    employees: 160,
    founded: 2017,
    Industry: 'IoT',
    GrowjoRanking: 980,
    PreviousRanking: 1025,
    estimated_revenues: 14500000,
    job_openings: 17,
    keywords: 'Sensors, Water Quality, Analytics',
    LeadInvestors: 'Lightspeed Venture Partners',
    btype: 'Private',
    valuation: 78000000,
    total_funding: '$39M',
    growth_percentage: '21%'
  }
];

const generateCompanyRecord = (template, index) => {
  const sequence = index + 1;
  const slug = `${slugify(template.company_name)}-${sequence}`;

  return {
    ...template,
    company_name: `${template.company_name} ${sequence}`,
    url: `https://www.${slug}.example`,
    linkedin_url: `https://www.linkedin.com/company/${slug}`,
    product_url: `https://www.${slug}.example/platform`,
    indeed_url: `https://www.indeed.com/cmp/${slug.replace(/-/g, '-')}`,
    contact_info: `contact+${sequence}@${slug}.example`,
    GrowjoRanking: template.GrowjoRanking + sequence * 3,
    PreviousRanking: template.PreviousRanking + sequence * 4,
    employees: template.employees + sequence * 5,
    estimated_revenues: template.estimated_revenues + sequence * 150000,
    job_openings: template.job_openings + (sequence % 8),
    valuation: template.valuation + sequence * 850000,
    total_funding: `$${(40 + sequence * 0.75).toFixed(1)}M`,
    founded: template.founded + (sequence % 5),
    growth_percentage: `${18 + (sequence % 8)}%`
  };
};

const companies = Array.from({ length: 50 }, (_, index) =>
  generateCompanyRecord(companyTemplates[index % companyTemplates.length], index)
);

const jobTemplates = [
  {
    title: 'Frontend Engineer',
    salaryRange: [90000, 120000],
    description:
      'Build responsive web applications with modern frameworks while collaborating closely with product and design.',
    baseRating: 4.4,
    size: '201 to 500 employees',
    ownership: 'Private',
    industry: 'Software',
    sector: 'Technology',
    revenue: '$10 to $25 million (USD)',
    competitors: 'N/A'
  },
  {
    title: 'Data Scientist',
    salaryRange: [105000, 145000],
    description:
      'Design predictive models, partner with engineering to productionize insights, and coach teams on data best practices.',
    baseRating: 4.6,
    size: '201 to 500 employees',
    ownership: 'Private',
    industry: 'Software',
    sector: 'Technology',
    revenue: '$25 to $50 million (USD)',
    competitors: 'Snowflake'
  },
  {
    title: 'Product Manager',
    salaryRange: [98000, 138000],
    description:
      'Define product strategy, prioritize roadmaps, and orchestrate cross-functional execution with measurable outcomes.',
    baseRating: 4.5,
    size: '501 to 1,000 employees',
    ownership: 'Private',
    industry: 'HealthTech',
    sector: 'Healthcare',
    revenue: '$25 to $50 million (USD)',
    competitors: 'Teladoc Health'
  },
  {
    title: 'Energy Systems Analyst',
    salaryRange: [82000, 108000],
    description:
      'Analyze renewable energy deployments, identify efficiency gains, and partner with operations on field execution.',
    baseRating: 4.2,
    size: '51 to 200 employees',
    ownership: 'Private',
    industry: 'CleanTech',
    sector: 'Energy',
    revenue: '$5 to $10 million (USD)',
    competitors: 'SunPower'
  },
  {
    title: 'DevOps Engineer',
    salaryRange: [97000, 132000],
    description:
      'Automate deployment pipelines, monitor cloud infrastructure, and ensure high availability for mission-critical systems.',
    baseRating: 4.3,
    size: '201 to 500 employees',
    ownership: 'Private',
    industry: 'Software',
    sector: 'Technology',
    revenue: '$10 to $25 million (USD)',
    competitors: 'HashiCorp'
  }
];

const jobs = Array.from({ length: 50 }, (_, index) => {
  const template = jobTemplates[index % jobTemplates.length];
  const company = companies[index % companies.length];
  const salaryBump = (index % 6) * 1500;
  const salaryMin = template.salaryRange[0] + salaryBump;
  const salaryMax = template.salaryRange[1] + salaryBump + 5000;

  return {
    'Job Title': template.title,
    'Salary Estimate': `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`,
    'Job Description': `${template.description} Opportunity batch #${index + 1}.`,
    Rating: Number((template.baseRating + (index % 3) * 0.1).toFixed(1)),
    'Company Name': company.company_name,
    Location: `${company.city}, ${company.state}`,
    Headquarters: `${company.city}, ${company.state}`,
    Size: template.size,
    Founded: company.founded,
    'Type of ownership': template.ownership,
    Industry: template.industry,
    Sector: template.sector,
    Revenue: template.revenue,
    Competitors: template.competitors,
    'Easy Apply': index % 2 === 0
  };
});

const firstNames = [
  'Alex',
  'Jordan',
  'Taylor',
  'Casey',
  'Morgan',
  'Riley',
  'Sydney',
  'Harper',
  'Parker',
  'Quinn',
  'Reese',
  'Dakota',
  'Emerson',
  'Hayden',
  'Rowan',
  'Sawyer',
  'Tatum',
  'Blair',
  'Dakari',
  'Elliott'
];

const lastNames = [
  'Johnson',
  'Garcia',
  'Patel',
  'Nguyen',
  'Brooks',
  'Santiago',
  'Rivera',
  'Hughes',
  'Foster',
  'Khan',
  'Walker',
  'Armstrong',
  'Ali',
  'Hernandez',
  'Diaz',
  'Singh',
  'Kim',
  'Ochoa',
  'Holland',
  'Nakamura'
];

const salaries = Array.from({ length: 40 }, (_, index) => {
  const company = companies[index % companies.length];
  const jobTemplate = jobTemplates[index % jobTemplates.length];
  const basePay = 72000 + (index % 10) * 4500 + Math.floor(index / 10) * 6000;
  const overtimePay = (index % 4) * 1200;
  const otherPay = (index % 5) * 950;
  const totalPay = basePay + overtimePay + otherPay;
  const totalPayBenefits = totalPay + 18000 + (index % 3) * 2500;
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[(index * 3) % lastNames.length];

  return {
    Id: 1001 + index,
    EmployeeName: `${firstName} ${lastName}`,
    JobTitle: jobTemplate.title,
    BasePay: basePay,
    OvertimePay: overtimePay,
    OtherPay: otherPay,
    TotalPay: totalPay,
    TotalPayBenefits: totalPayBenefits,
    Year: 2022 + (index % 4),
    Agency: company.company_name
  };
});

const jobApplications = [
  {
    job_id: 'frontend-engineer',
    firstName: 'Taylor',
    lastName: 'Reed',
    email: 'taylor.reed@example.com',
    phone: 5551234400,
    positionApplied: 'Frontend Engineer',
    coverLetter: 'I am passionate about building accessible and performant user experiences.',
    interviewDate: new Date('2024-11-18'),
    resume: 'uploads/sample-resume-taylor.pdf'
  },
  {
    job_id: 'clinical-product-manager',
    firstName: 'Jordan',
    lastName: 'Nguyen',
    email: 'jordan.nguyen@example.com',
    phone: 5559872233,
    positionApplied: 'Clinical Product Manager',
    coverLetter: 'Experience leading healthcare product teams with a focus on patient outcomes.',
    interviewDate: new Date('2024-12-04'),
    resume: 'uploads/sample-resume-jordan.pdf'
  }
];

module.exports = {
  users,
  companies,
  jobs,
  salaries,
  jobApplications
};
