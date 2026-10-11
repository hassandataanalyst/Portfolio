/**
 * ============================================
 * MUHAMMAD HASSAN — PROJECTS-DATA.JS
 * Portfolio projects data
 * All fields consistent for projects.js and home.js
 * ============================================
 *
 * FIELD REFERENCE:
 *   - id                   : unique ID
 *   - slug                 : URL-friendly identifier
 *   - title                : project name
 *   - category             : used for filter buttons
 *   - shortDescription     : one-line summary (gallery cards)
 *   - technologies         : array of tool names
 *   - status               : badge text
 *   - overview             : detailed intro
 *   - problemStatement     : what problem it solves
 *   - methodology          : how it was built
 *   - insights             : key findings
 *   - learningObjectives   : what was learned
 *   - imagePath            : relative path to thumbnail
 *   - githubUrl            : (optional) link to repo
 *   - liveUrl              : (optional) link to live demo
 *   - featured             : show on homepage
 * ============================================
 */

const projectsData = [
  /* ------------------------------------------
     PROJECT 1 — Web Scraping
     ------------------------------------------ */
  {
    id: 'web-scraping-extraction',
    slug: 'web-scraping-extraction',
    title: 'Web Scraping & Data Extraction',
    category: 'Web Scraping',
    shortDescription: 'An illustrative workflow for extracting structured information from public web pages and preparing it for analysis.',
    technologies: ['Python', 'BeautifulSoup', 'Pandas', 'Requests'],
    status: 'Demo Project',
    overview: 'This project demonstrates the process of programmatically extracting data from publicly accessible websites. The workflow handles HTML parsing, pagination, and data cleaning to produce a structured CSV dataset ready for analysis.',
    problemStatement: 'Raw data is often locked inside complex web page structures, making it difficult to analyze efficiently without manual copy-pasting. Manual extraction is slow, error-prone, and does not scale.',
    methodology: 'Implemented a Python script using BeautifulSoup to parse DOM elements, extract targeted information using CSS selectors, handle pagination, and organize the extracted records into a Pandas DataFrame. Output was saved to CSV format for downstream analysis.',
    insights: 'Automating data extraction saves hours of manual work, ensures data consistency, and enables repeatable data collection schedules. The structured output can be immediately plugged into analysis or BI tools.',
    learningObjectives: 'Understanding DOM traversal, handling HTTP requests and headers, respecting robots.txt, structuring unstructured data, and building resilient scrapers with error handling.',
    imagePath: 'assets/images/projects/web_scraping.jpg',
    githubUrl: '',
    liveUrl: '',
    featured: true
  },

  /* ------------------------------------------
     PROJECT 2 — Exploratory Data Analysis
     ------------------------------------------ */
  {
    id: 'exploratory-data-analysis',
    slug: 'exploratory-data-analysis',
    title: 'Exploratory Data Analysis',
    category: 'Data Analytics',
    shortDescription: 'A sample analytical workflow demonstrating data cleaning, exploratory analysis, and visualization of dataset patterns.',
    technologies: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
    status: 'Demo Project',
    overview: 'A comprehensive exploration of a synthetic dataset to identify underlying patterns, correlations, and anomalies before formal reporting. This workflow mirrors the initial phase of any real-world data analytics project.',
    problemStatement: 'Raw datasets often contain missing values, outliers, and hidden trends that must be addressed before business decisions can be made. Skipping EDA leads to unreliable conclusions.',
    methodology: 'Used Pandas for data cleaning, handling missing values, and aggregations. Applied Matplotlib and Seaborn for visualizing distributions, correlations, trends, and categorical relationships. Documented findings in a structured notebook.',
    insights: 'Identified key seasonal trends and outlier clusters that significantly impacted overall metric averages. Correlation analysis revealed strong relationships between specific variables that were not immediately obvious.',
    learningObjectives: 'Applying statistical summaries, handling missing data effectively, selecting appropriate chart types for different data, and communicating findings clearly.',
    imagePath: 'assets/images/projects/eda_charts.jpg',
    githubUrl: '',
    liveUrl: '',
    featured: true
  },

  /* ------------------------------------------
     PROJECT 3 — Financial Health Dashboard
     ------------------------------------------ */
  {
    id: 'financial-health-dashboard',
    slug: 'financial-health-dashboard',
    title: 'Financial Health Dashboard',
    category: 'Power BI',
    shortDescription: 'An illustrative financial dashboard concept presenting revenue, expenses, profitability, and financial trends.',
    technologies: ['Power BI', 'Power Query', 'DAX', 'Excel'],
    status: 'Demo Project',
    overview: 'An interactive dashboard designed to monitor organizational financial health, consolidating revenue streams and expense tracking into a single unified view for stakeholders.',
    problemStatement: 'Stakeholders need a real-time, consolidated view of financial performance rather than static, disconnected spreadsheet reports that require manual compilation every month.',
    methodology: 'Transformed synthetic financial records using Power Query, developed DAX measures for KPIs like profit margin and YoY growth, and designed an intuitive dashboard layout with drill-down capabilities.',
    insights: 'Provides clear visibility into monthly profit margins and highlights expense categories exceeding budget thresholds. Enables faster month-end review and more confident forecasting.',
    learningObjectives: 'Data modeling best practices, DAX measure creation, dashboard UI design, and understanding financial KPIs.',
    imagePath: 'assets/images/projects/financial_health.jpg',
    githubUrl: '',
    liveUrl: '',
    featured: true
  },

  /* ------------------------------------------
     PROJECT 4 — HR Analytics Dashboard
     ------------------------------------------ */
  {
    id: 'hr-analytics-dashboard',
    slug: 'hr-analytics-dashboard',
    title: 'Human Resources Analytics Dashboard',
    category: 'Power BI',
    shortDescription: 'A comprehensive dashboard for tracking employee turnover, recruitment, and workforce distribution.',
    technologies: ['Power BI', 'DAX', 'Excel', 'Power Query'],
    status: 'Demo Project',
    overview: 'This project illustrates how HR data can be visualized to monitor workforce metrics, retention rates, and departmental distributions in an interactive dashboard format.',
    problemStatement: 'HR departments struggle to quickly analyze headcount trends and identify factors contributing to employee turnover without manually compiling data from multiple sources.',
    methodology: 'Aggregated employee records, calculated retention metrics using DAX, and built interactive visualizations to filter by department, tenure, and demographic segments.',
    insights: 'Revealed specific departments with higher-than-average turnover, enabling targeted retention strategies. Recruitment funnel analysis showed bottlenecks at specific interview stages.',
    learningObjectives: 'Working with demographic data, calculating time-based metrics, designing HR-specific visuals, and applying data-driven thinking to people analytics.',
    imagePath: 'assets/images/projects/hr_analytics.jpg',
    githubUrl: '',
    liveUrl: '',
    featured: false
  },

  /* ------------------------------------------
     PROJECT 5 — Sales Performance Dashboard
     ------------------------------------------ */
  {
    id: 'sales-performance-dashboard',
    slug: 'sales-performance-dashboard',
    title: 'Sales Performance Dashboard',
    category: 'Tableau',
    shortDescription: 'A visual report tracking regional sales performance, pipeline conversion, and revenue targets.',
    technologies: ['Tableau', 'SQL', 'Excel'],
    status: 'Demo Project',
    overview: 'An illustrative Tableau dashboard that tracks sales rep performance against targets, regional revenue, and sales pipeline health across multiple dimensions.',
    problemStatement: 'Sales managers lack visibility into regional performance and need a centralized tool to track pipeline conversions and identify underperforming segments quickly.',
    methodology: 'Connected Tableau to a prepared dataset, created calculated fields for quota attainment, and designed interactive maps and bar charts with filter actions for drill-down exploration.',
    insights: 'Highlighted top-performing regions and identified bottlenecks in the sales conversion funnel, allowing targeted coaching and territory rebalancing.',
    learningObjectives: 'Connecting data sources, building interactive maps, designing executive-level summaries, and understanding sales KPIs.',
    imagePath: 'assets/images/projects/sales_performance.jpg',
    githubUrl: '',
    liveUrl: '',
    featured: false
  },

  /* ------------------------------------------
     PROJECT 6 — Business Intelligence Dashboard
     ------------------------------------------ */
  {
    id: 'tableau-bi-dashboard',
    slug: 'tableau-bi-dashboard',
    title: 'Tableau Business Intelligence Dashboard',
    category: 'Business Intelligence',
    shortDescription: 'A conceptual BI dashboard demonstrating advanced data visualization, interactive filters, and executive reporting.',
    technologies: ['Tableau', 'Data Modeling', 'SQL'],
    status: 'Demo Project',
    overview: 'A comprehensive Business Intelligence dashboard designed to give executives a high-level overview of enterprise performance metrics with drill-down capability into departments.',
    problemStatement: 'Executive teams need a quick, unified view of cross-departmental KPIs without digging into granular data tables or waiting for monthly reports.',
    methodology: 'Designed a multi-pane Tableau dashboard using advanced filtering, parameter actions, and highly optimized visual hierarchies to support executive decision-making.',
    insights: 'Enables fast, data-driven decisions by providing immediate visual feedback on key performance indicators across departments and time periods.',
    learningObjectives: 'Advanced Tableau dashboard design, parameter actions, layout optimization, and understanding enterprise-level BI architecture.',
    imagePath: 'assets/images/projects/tableau_bi.jpg',
    githubUrl: '',
    liveUrl: '',
    featured: false
  }
];

/* ============================================
   OPTIONAL: SORT BY FEATURED
   ============================================ */
// Uncomment below if you want featured projects to appear first everywhere
// projectsData.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));