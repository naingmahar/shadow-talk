export const SECTOR_DATA = {
  "FRONTEND DEVELOPMENT": {
    positions: ["Frontend Developer", "React Specialist", "UI Engineer", "Next JS Developer", "Web Performance Expert"],
    tools: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Zustand", "Playwright", "Lighthouse", "Web Vitals"],
    subtopics: {
      "INTERVIEW": [
        // PERFORMANCE OPTIMIZATION
        "Core Web Vitals LCP and CLS Optimization",
        "Tree Shaking and Bundle Size Reduction",
        "Memoization and Reducing Component Re-renders",
        "Critical Rendering Path and Asset Prioritization",
        "Lazy Loading and Code Splitting Strategies",
        "Web Workers for Off-Main-Thread Processing",
        // TESTING & QA
        "End to End Testing with Playwright",
        "Unit Testing React Hooks with Jest",
        "Integration Testing for API Workflows",
        "Visual Regression Testing and Snapshot Logic",
        "Mocking Service Workers for Network Isolation",
        "Testing Library Best Practices and Accessibility",
        // ARCHITECTURE & REQUIREMENTS
        "Hydration and Server Side Rendering logic",
        "Micro Frontend Architecture and Composition",
        "State Management Prop Drilling vs Context API",
        "Atomic Design Patterns for Scalability",
        "CORS and Frontend Security Best Practices",
        "Responsive Design and Fluid Layout Logic"
      ],
      "DAILY STANDUP": ["Sprint Status", "Blockers"],
      "PEER REVIEW": ["Code Quality", "UI Consistency"]
    }
  },
  "BACKEND DEVELOPMENT": {
    positions: ["Backend Developer", "API Architect", "Database Engineer", "Cloud Engineer", "Distributed Systems Specialist"],
    tools: ["Node JS", "PostgreSQL", "Redis", "Kafka", "Docker", "Nest JS", "Prometheus", "New Relic"],
    subtopics: {
      "INTERVIEW": [
        // PERFORMANCE OPTIMIZATION
        "Database Query Execution Plan Analysis",
        "Connection Pooling and Deadlock Prevention",
        "Distributed Caching with Redis and TTL Logic",
        "Load Balancing and Traffic Shaping Strategies",
        "Horizontal Scaling and Auto-scaling Groups",
        "Message Queue Latency and Throughput Tuning",
        // TESTING & QA
        "Integration Testing for Microservices",
        "Load and Stress Testing with k6 or JMeter",
        "Contract Testing for API Reliability",
        "Chaos Engineering and Fault Injection Logic",
        "Database Migration Rollback and Safety Testing",
        "Mocking External Services in CI CD Pipelines",
        // ARCHITECTURE & REQUIREMENTS
        "Database Sharding and Indexing Strategy",
        "REST vs GraphQL vs gRPC Tradeoffs",
        "ACID vs BASE Transaction Models",
        "Event Driven Architecture and Pub Sub Patterns",
        "Zero Trust Security and API Gateway Logic",
        "Rate Limiting and DDoS Mitigation Patterns"
      ],
      "DAILY STANDUP": ["API Status", "Database Health"],
      "PEER REVIEW": ["Logic Review", "Middleware Audit"]
    }
  },
  "MOBILE DEVELOPMENT": {
    positions: ["React Native Developer", "iOS Engineer", "Android Developer", "Flutter Developer", "Mobile Architect"],
    tools: ["React Native", "Swift", "Kotlin", "Firebase", "App Store Connect", "Expo", "Sentry", "Flipper"],
    subtopics: {
      "INTERVIEW": [
        // PERFORMANCE OPTIMIZATION
        "Memory Management and Tracking Leaks",
        "Optimizing FlatList and Image Rendering",
        "Native Thread vs JavaScript Thread Latency",
        "App Startup Time Cold vs Warm Start",
        "Battery Consumption and Background Tasks",
        "Binary Size Reduction and Hermes Engine",
        // TESTING & QA
        "Automated UI Testing with Detox or Appium",
        "Cross Device Compatibility and Simulation",
        "Beta Testing with TestFlight and Play Console",
        "Simulating Low Network and Offline Syncing",
        "Error Monitoring and Crashlytics RCA",
        "Snapshot Testing for Cross Platform UI",
        // ARCHITECTURE & REQUIREMENTS
        "Native Bridge and JSI Communication",
        "Managing App Permissions and Privacy",
        "Push Notification Lifecycle and Logic",
        "Over the Air Updates with CodePush",
        "Deep Linking and Universal Link Handling",
        "Biometric Authentication Integration"
      ],
      "DAILY STANDUP": ["Build Progress", "Platform Bugs"],
      "PEER REVIEW": ["Bundle Analysis", "Navigation Audit"]
    }
  },
  "UI/UX DESIGN": {
    positions: ["Product Designer", "UI Engineer", "UX Researcher", "Interaction Designer", "Design Systems Lead"],
    tools: ["Figma", "Adobe XD", "Storybook", "Framer", "Miro", "Hotjar", "Zeplin"],
    subtopics: {
      "CLIENT MEETING": ["User Persona Presentation", "Design System Scalability", "Accessibility (WCAG) Compliance", "Prototyping Feedback"],
      "DAILY STANDUP": ["Component Library Updates", "User Testing Results", "Handoff to Engineering", "Visual Regression Issues"],
      "INTERVIEW": ["Design Thinking Process", "Handling Critical Design Feedback", "Balancing Aesthetics and Usability"],
      "PRESENTATION": ["Brand Visual Identity Rollout", "Information Architecture Overview", "Conversion Rate Optimization (CRO) Results"]
    }
  },
  "DEVOPS & CLOUD": {
    positions: ["DevOps Engineer", "Site Reliability Engineer (SRE)", "Cloud Architect", "Platform Engineer", "Security Engineer"],
    tools: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Prometheus", "Ansible", "GitHub Actions", "Cloudflare"],
    subtopics: {
      "DAILY STANDUP": ["Infrastructure Downtime Report", "CI/CD Pipeline Failure", "Load Balancer Latency", "Log Aggregation Issues"],
      "TECHNICAL PRESENTATION": ["Blue-Green Deployment Strategy", "Auto-scaling & Cost Optimization", "Disaster Recovery Planning", "Zero Trust Security Model"],
      "INTERVIEW": ["Incident Post-Mortem Analysis", "Infrastructure as Code (IaC) Benefits", "Container Orchestration Best Practices"]
    }
  },
  "DATA & AI": {
    positions: ["Data Scientist", "AI/ML Engineer", "Data Engineer", "BI Analyst", "Data Architect"],
    tools: ["Python (Pandas/PyTorch)", "Apache Kafka", "Snowflake", "Spark", "Tableau", "TensorFlow", "Hadoop"],
    subtopics: {
      "DAILY STANDUP": ["Model Training Accuracy", "Data Pipeline ETL Latency", "Feature Engineering Progress", "Dataset Cleaning"],
      "TECHNICAL PRESENTATION": ["Predictive Analytics Roadmap", "Vector Database Implementation", "Large Language Model (LLM) Fine-tuning"],
      "CLIENT MEETING": ["Data Insights & ROI", "Privacy & Data Governance", "Predictive Trend Analysis"]
    }
  },
  "TECH PROJECT MANAGEMENT": {
    positions: ["Technical Project Manager", "Scrum Master", "Product Owner", "Agile Coach", "Delivery Manager"],
    tools: ["Jira", "Confluence", "Asana", "Miro", "Roadmunk", "Productboard"],
    subtopics: {
      "DAILY STANDUP": ["Sprint Velocity & Burn-down", "Removing Team Blockers", "Backlog Grooming Status", "Resource Allocation"],
      "CLIENT MEETING": ["Project Roadmap Milestone Review", "Scope Creep & Change Requests", "Stakeholder Expectation Management"],
      "PRESENTATION": ["Post-Implementation Review", "Agile Transformation Progress", "Risk Mitigation Strategy"]
    }
  },
  "FINANCIAL & BANKING": {
    positions: ["Loan Officer", "Credit Analyst", "Branch Manager", "Investment Banker", "Financial Advisor", "Compliance Officer", "Risk Manager", "Internal Auditor", "Wealth Manager", "Actuary", "Treasury Manager"],
    tools: ["Core Banking System", "Risk Assessment Tool", "Excel VBA", "Bloomberg Terminal", "QuickBooks", "SAP FICO", "Oracle Financials", "Reuters Eikon", "SQL for Finance", "PowerBI"],
    subtopics: {
      "CLIENT MEETING": ["Mortgage Application Review", "Investment Portfolio Update", "Loan Restructuring", "Wealth Management Strategy", "Trust and Estate Planning", "Hedge Fund Performance", "Tax Optimization Strategies"],
      "DAILY STANDUP": ["Portfolio Delinquency Rates", "Daily Target Achievement", "Market Volatility Impact", "Liquidity Ratios", "Inter-bank Lending Rates", "Compliance Flag Reviews"],
      "INTERVIEW": ["KYC/AML Compliance", "Financial Modeling", "Credit Risk Evaluation", "Regulatory Frameworks", "Ethical Banking Standards", "Basel III Accords", "Asset-Liability Management"],
      "SALARY NEGOTIATION": ["Commission Structure", "Annual Bonus Review", "Performance-Based Equity", "Profit Sharing Arrangements", "Deferred Compensation Plans"]
    }
  },
  "HEALTHCARE & BIOTECH": {
    positions: ["Medical Administrator", "Health Informatics Specialist", "Clinic Coordinator", "Pharmaceutical Representative", "Lab Manager", "Public Health Officer", "Clinical Research Associate", "Epidemiologist"],
    tools: ["Electronic Health Records (EHR)", "Telehealth Platforms", "PACS System", "Medical Billing Software", "LIMS", "Epic Systems", "Cerner", "Medidata Rave"],
    subtopics: {
      "CLIENT MEETING": ["Patient Care Coordination", "Insurance Provider Negotiation", "Clinic Workflow Optimization", "Treatment Plan Review", "Telemedicine Adoption Strategy"],
      "PRESENTATION": ["New Medical Protocol Rollout", "Healthcare Data Privacy (HIPAA)", "Annual Quality Audit Results", "Patient Safety Initiatives", "Clinical Trial Phase 3 Results", "Pharmacovigilance Updates"],
      "INTERVIEW": ["Patient Confidentiality", "Crisis Intervention", "Interdisciplinary Collaboration", "Medical Ethics Case Study", "Resource Allocation in Emergency"]
    }
  },
  "LOGISTICS & MARITIME": {
    positions: ["Supply Chain Manager", "Logistics Coordinator", "Warehouse Supervisor", "Procurement Officer", "Inventory Analyst", "Freight Forwarder", "Fleet Manager", "Port Operations Lead"],
    tools: ["ERP (Oracle/SAP)", "Warehouse Management System (WMS)", "TMS", "Fleet Tracking", "RFID Systems", "Incoterms 2020", "CargoWise", "Tableau"],
    subtopics: {
      "DAILY STANDUP": ["Shipment Delays & Bottlenecks", "Inventory Shrinkage Reports", "Last-Mile Delivery Metrics", "Fuel Surcharge Adjustments", "Cross-docking Efficiency"],
      "CLIENT MEETING": ["Vendor Performance Review", "SLA Negotiation", "Logistics Cost Optimization", "Container Shortage Crisis", "Customs Clearance Hurdles"],
      "PRESENTATION": ["Route Optimization Analysis", "Supply Chain Sustainability", "Warehouse Automation ROI", "Cold Chain Integrity Management"]
    }
  },
  "BUSINESS & STRATEGY": {
    positions: ["Operations Manager", "Business Analyst", "General Manager", "Management Consultant", "Strategy Lead", "Chief of Staff"],
    tools: ["SAP S/4HANA", "Tableau", "PowerBI", "Salesforce", "MECE Framework", "SWOT Analysis Tool", "Six Sigma Tools"],
    subtopics: {
      "CLIENT MEETING": ["Strategic Partnership Discussion", "Contract Renewal", "Vendor Management", "Mergers & Acquisitions Overview", "Market Entry Strategy"],
      "TECHNICAL PRESENTATION": ["Quarterly Business Review", "Operational Efficiency Report", "Market Expansion Plan", "Digital Transformation Roadmap", "Cost-Benefit Analysis"],
      "SALARY NEGOTIATION": ["Department Budget Allocation", "Equity and Options", "Bonus Structure Review", "Non-compete Clause Discussion"]
    }
  },
  "MARKETING & ADVERTISING": {
    positions: ["SEO Specialist", "Content Manager", "Ads Expert", "Social Media Manager", "Art Director", "Brand Strategist", "Copywriter", "Growth Hacker", "Email Marketer"],
    tools: ["Google Analytics 4", "Meta Ads Manager", "HubSpot", "Semrush", "Adobe Creative Cloud", "Sprout Social", "Mailchimp", "Hotjar"],
    subtopics: {
      "CLIENT MEETING": ["Campaign Performance Review", "Competitor Analysis", "ROI Discussion", "Creative Pitch Presentation", "Attribution Modeling", "Influencer Outreach Results"],
      "TECHNICAL PRESENTATION": ["New Brand Strategy", "Social Media Growth Plan", "Conversion Rate Optimization", "User Persona Analysis", "A/B Testing Methodology"],
      "INTERVIEW": ["Lead Generation Tactics", "Content Strategy Planning", "Visual Storytelling", "Brand Voice Consistency", "Crisis PR Management"]
    }
  },
  "NGO & INTERNATIONAL DEV": {
    positions: ["Program Coordinator", "Field Officer", "Grant Writer", "Advocacy Lead", "Volunteer Manager", "Monitoring & Evaluation (M&E) Specialist"],
    tools: ["LogFrame", "Donor CRM", "Project Tracker", "Impact Metrics", "KoboToolbox", "NVivo", "SPSS"],
    subtopics: {
      "CLIENT MEETING": ["Donor Impact Report", "Community Needs Assessment", "Stakeholder Alignment", "Partnership Proposal", "Field Security Briefing"],
      "TECHNICAL PRESENTATION": ["Annual Sustainability Plan", "Funding Proposal Overview", "Field Data Visualization", "The Theory of Change", "Logic Model Review"],
      "INTERVIEW": ["Field Experience", "Ethical Decision Making", "Crisis Management", "Cross-Cultural Communication", "Grant Compliance Standards"]
    }
  },
  "HOSPITALITY & REAL ESTATE": {
    positions: ["Hotel Manager", "Operations Supervisor", "Guest Relations Manager", "Events Coordinator", "Real Estate Agent", "Property Consultant", "Facility Manager"],
    tools: ["Property Management System (PMS)", "Expedia Partner Central", "TableOpen", "Salesforce", "Zillow Premier", "MLS Database", "Buildium"],
    subtopics: {
      "DAILY STANDUP": ["Occupancy Forecasts", "VIP Arrivals & Special Requests", "Staffing Shift Adjustments", "Maintenance Backlog"],
      "CLIENT MEETING": ["Event Space Booking", "Corporate Account Renewal", "Property Valuation Presentation", "Lease Agreement Review"],
      "INTERVIEW": ["Conflict Resolution with Guests", "Service Excellence Standards", "Revenue Management", "Closing a High-Value Deal"]
    }
  },
  "LEGAL & COMPLIANCE": {
    positions: ["Corporate Lawyer", "Paralegal", "Compliance Specialist", "Legal Secretary", "Contract Manager", "Data Privacy Officer", "General Counsel"],
    tools: ["Clio", "LexisNexis", "DocuSign", "Case Management Software", "OneTrust", "Ironclad"],
    subtopics: {
      "CLIENT MEETING": ["Case Strategy Discussion", "Contract Negotiation", "Deposition Preparation", "Settlement Proposal", "Due Diligence Findings"],
      "PRESENTATION": ["Regulatory Change Analysis (GDPR/CCPA)", "Corporate Governance Review", "Intellectual Property Strategy", "Compliance Risk Assessment"],
      "INTERVIEW": ["Conflict of Interest Check", "Case Law Research Methodology", "Drafting Precision", "Regulatory Liaison Experience"]
    }
  },
  "DAILY & TRAVEL CONVERSATION": {
    positions: ["Traveler", "Guest", "Customer", "Passenger", "Client", "Tourist"],
    tools: ["Face-to-Face", "Phone Call", "Translation App", "Booking Confirmation", "Digital Menu"],
    subtopics: {
      "AIRPORT & IMMIGRATION": [
        "Answering Customs and Immigration Questions",
        "Reporting Missing or Damaged Luggage",
        "Inquiring about Flight Delays or Gate Changes",
        "Requesting a Seat Upgrade at Check-in",
        "Navigating Security Screening Instructions",
        "Ordering Duty Free Items and Tax Refunds"
      ],
      "HOTEL & ACCOMMODATION": [
        "Checking In and Confirming Room Features",
        "Reporting a Maintenance Issue (AC, Wi-Fi, Plumbing)",
        "Requesting a Late Check-out or Room Upgrade",
        "Asking for Local Restaurant Recommendations",
        "Complaining about Noise or Room Cleanliness",
        "Arranging an Early Morning Wake-up Call"
      ],
      "RESTAURANT & BAR": [
        "Making a Reservation for a Large Group",
        "Ordering Food with Specific Dietary Restrictions",
        "Asking the Sommelier for Wine Recommendations",
        "Sending Back Food that is Under-cooked",
        "Handling a Mistake on the Final Bill",
        "Ordering Signature Cocktails at a Busy Bar",
        "Requesting the Check and Splitting the Bill"
      ],
      "REQUESTS & SERVICES": [
        "Asking for Directions in a Crowded City",
        "Hailing a Taxi and Negotiating the Fare",
        "Booking a Guided Tour or Entrance Tickets",
        "Requesting Help at a Pharmacy or Clinic",
        "Buying a Local SIM Card and Data Plan",
        "Asking to Borrow or Charge an Electronic Device"
      ],
      "OFFICE & SOCIAL": [
        "Salary and Compensation Negotiation",
        "Handling Conflict with a Team Member",
        "Small Talk about Weekend and Hobbies",
        "Introducing Yourself to a New Department",
        "Explaining a Personal Emergency to HR"
      ]
    }
  }
};