/**
 * ============================================
 * MUHAMMAD HASSAN — CONTENT-DATA.JS
 * Centralized content: services, skills, stats
 * Used by Service Finder, About page, Hero sections
 * ============================================
 */

const contentData = {

  /* ============================================
     SERVICES (Service Finder Mini-App)
     ============================================ */
  services: [
    {
      id: 'clean',
      tag: 'Data Analytics & Cleaning',
      title: 'Transforming raw spreadsheets into analysis-ready data.',
      description: 'Raw spreadsheets often contain duplicates, missing fields, or incorrect formats that prevent accurate analysis. I use Python and Excel to programmatically clean, merge, and structure your files.',
      deliverables: 'Cleaned CSV/Excel files, summary reports',
      tools: 'Python, Pandas, Excel Power Query',
      icon: 'database'
    },
    {
      id: 'dashboard',
      tag: 'Dashboards & Business Intelligence',
      title: 'Seeing the big picture clearly.',
      description: 'A visual dashboard consolidates your metrics into an interactive format. I design intuitive Power BI and Tableau dashboards that highlight trends without overwhelming the viewer.',
      deliverables: 'Interactive .pbix/.twbx files, PDF reports',
      tools: 'Power BI, Tableau, DAX',
      icon: 'chart'
    },
    {
      id: 'scrape',
      tag: 'Web Scraping & Data Extraction',
      title: 'Automating data collection from the web.',
      description: 'Manual copy-pasting is inefficient. I write ethical, efficient Python scripts to extract publicly accessible information from websites and organize it into useful datasets.',
      deliverables: 'Structured JSON/CSV datasets, scraper scripts',
      tools: 'Python, BeautifulSoup, Requests',
      icon: 'globe'
    },
    {
      id: 'automate',
      tag: 'Python Automation',
      title: 'Reclaiming hours spent on repetitive tasks.',
      description: 'Repetitive daily or weekly data tasks waste valuable time. A custom script can automate file manipulation, data merging, or basic reporting workflows flawlessly.',
      deliverables: 'Documented Python scripts, execution guides',
      tools: 'Python, OS modules, Automation scripts',
      icon: 'cog'
    },
    {
      id: 'sql',
      tag: 'SQL Data Analysis',
      title: 'Querying databases for actionable answers.',
      description: 'Database records often require complex joins and aggregations to answer specific business questions. I write optimized SQL queries to extract exactly what you need.',
      deliverables: 'Optimized SQL queries, extracted data tables',
      tools: 'SQL, Relational Databases',
      icon: 'terminal'
    }
  ],

  /* ============================================
     SKILLS (About page — Bento Grid)
     ============================================ */
  skills: [
    {
      title: 'Data & Analysis',
      description: 'Python, Pandas, SQL Queries, Data Cleaning, EDA, Joins & Aggregations',
      category: 'analytics',
      icon: 'chart-line'
    },
    {
      title: 'Visualization',
      description: 'Power BI, Tableau, Excel Dashboards, DAX, Power Query',
      category: 'visualization',
      icon: 'chart-bar'
    },
    {
      title: 'Extraction',
      description: 'Web Scraping, BeautifulSoup, Requests, Automation Scripts',
      category: 'extraction',
      icon: 'code'
    },
    {
      title: 'Tools',
      description: 'Git, GitHub, VS Code, Jupyter Notebook, Google Colab',
      category: 'tools',
      icon: 'tool'
    }
  ],

  /* ============================================
     HERO STATS (Homepage)
     ============================================ */
  heroStats: [
    {
      value: 3.53,
      label: 'CGPA / 4.00',
      decimals: 2,
      suffix: '',
      prefix: ''
    },
    {
      value: 6,
      label: 'Projects',
      decimals: 0,
      suffix: '+',
      prefix: ''
    },
    {
      value: 4,
      label: 'Certifications',
      decimals: 0,
      suffix: '',
      prefix: ''
    }
  ],

  /* ============================================
     APPROACH STEPS (Homepage)
     ============================================ */
  approachSteps: [
    {
      num: '01',
      title: 'Understand',
      description: 'We discuss your core problem, data sources, and intended outcomes to ensure complete alignment before work begins.'
    },
    {
      num: '02',
      title: 'Prepare',
      description: 'I extract, clean, and structure the raw data, handling missing values and inconsistencies using Python or SQL.'
    },
    {
      num: '03',
      title: 'Analyze',
      description: 'I conduct exploratory data analysis to uncover trends, patterns, and statistical summaries that answer your questions.'
    },
    {
      num: '04',
      title: 'Present',
      description: 'Findings are translated into clear, actionable formats—whether that is a clean CSV, a script, or an interactive dashboard.'
    }
  ],

  /* ============================================
     FAQ ITEMS
     ============================================ */
  faqs: [
    {
      q: 'Are the showcased projects real client projects?',
      a: 'Yes — every project in my portfolio was personally designed, built, and completed by me. From data extraction and cleaning to dashboard design and analysis, each project represents hands-on work I have done end-to-end. They reflect my real workflows, tools, and problem-solving approach.'
    },
    {
      q: 'What file formats do you work with?',
      a: 'I work confidently with all common data formats — CSV, Excel (.xlsx, .xls), JSON, XML, SQL databases, and API responses. I regularly extract, transform, and prepare data across these formats to produce clean, analysis-ready outputs in whatever structure your project requires.'
    },
    {
      q: 'Can you extract data from any website?',
      a: 'I build robust web scrapers using Python (BeautifulSoup, Requests, Selenium) for publicly accessible data. I always respect website terms of service, robots.txt guidelines, and applicable laws. I do not scrape private, authenticated, or sensitive personal data — but for public data, I can deliver structured, reliable, production-ready datasets.'
    },
    {
      q: 'Do you provide the raw code or finished dashboards?',
      a: 'Both — depending on what you need. I deliver documented, clean Python scripts, raw data files (CSV/JSON), static PDF reports, or fully interactive Power BI and Tableau dashboard files. Everything comes with proper documentation so you or your team can use and maintain it confidently.'
    },
    {
      q: 'How is project scope and delivery decided?',
      a: 'Every project begins with a clear conversation to understand your exact objectives, data sources, and expected outcomes. I then outline the deliverables, tools, and a realistic timeline. We agree on scope upfront — no surprises — and I keep you updated at every milestone until final delivery.'
    },
    {
      q: 'What tools and technologies do you use?',
      a: 'My core stack includes Python (Pandas, NumPy, BeautifulSoup, Requests), SQL (MySQL, PostgreSQL, SQLite), Power BI, Tableau, and advanced Excel. I also work with Git, Jupyter Notebook, and Google Colab for version control and collaborative work. I choose the right tool based on your project\'s specific needs.'
    },
    {
      q: 'How long does a typical project take?',
      a: 'Timelines depend on complexity. A focused data cleaning task or a single web scraper can be delivered in 2–4 days. A complete interactive dashboard typically takes 5–10 days. Larger analysis projects with multiple deliverables are scoped individually. I always give an honest, realistic timeline before starting.'
    }
  ],

  /* ============================================
     CERTIFICATIONS
     ============================================ */
  certifications: [
    {
      title: 'Introducing Data Analytics',
      issuer: 'Google via Coursera',
      date: '9 Sep, 2026',
      file: 'assets/documents/certificates/Data Analyst Certificate Coursera.pdf',
      verifyUrl: 'https://coursera.org/verify/OE8VNXVVOA6N'
    },
    {
      title: 'Data Analytics and BI',
      issuer: 'DigiSkills Training Program',
      date: '14 Mar, 2026',
      file: 'assets/documents/certificates/Data Analyst Certificate digiskills.pdf',
      verifyUrl: ''
    },
    {
      title: 'Hello, Python!',
      issuer: 'Google via Coursera',
      date: '9 Sep, 2026',
      file: 'assets/documents/certificates/Python Certificate Coursera.pdf',
      verifyUrl: 'https://coursera.org/verify/HYD5973X92MA'
    },
    {
      title: 'Freelancing',
      issuer: 'DigiSkills Training Program',
      date: '14 Mar, 2026',
      file: 'assets/documents/certificates/Freelancing Certificate digiskills.pdf',
      verifyUrl: ''
    }
  ],

  /* ============================================
     EDUCATION
     ============================================ */
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Emerson University Multan',
      period: '2023 - Present',
      detail: 'CGPA: 3.53 / 4.00'
    },
    {
      degree: 'Intermediate',
      institution: 'KIPS College Multan',
      period: '2021 - 2023',
      detail: 'Marks: 805 / 1100'
    },
    {
      degree: 'Matriculation',
      institution: 'Govt High School Rangeel Pur Multan',
      period: '2019 - 2021',
      detail: 'Marks: 1092 / 1100'
    }
  ],

  /* ============================================
     SOCIAL LINKS
     ============================================ */
  social: {
    email: 'muhassanbasri@gmail.com',
    gmailCompose: 'https://mail.google.com/mail/?view=cm&fs=1&to=muhassanbasri@gmail.com',
    linkedin: 'https://www.linkedin.com/in/muhammad-hassan-40b784373',
    github: 'https://github.com/hassandataanalyst',
    upwork: 'https://www.upwork.com/freelancers/~01fc7b70444042f505',
    facebook: 'https://www.facebook.com/profile.php?id=61582439774744',
    whatsapp: 'https://wa.me/923474414335'
  }
};

/* ============================================
   EXPORT FOR MODULE SYSTEMS (optional)
   ============================================ */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = contentData;
}