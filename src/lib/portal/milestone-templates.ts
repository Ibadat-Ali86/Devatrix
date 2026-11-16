export type MilestoneTemplate = { week: number; title: string; instructions: string };

const generic: MilestoneTemplate[] = [
  { week: 1, title: "Environment setup and learning plan", instructions: "Review the track brief, prepare your development environment, and share a short plan with your first small proof of setup." },
  { week: 2, title: "Core concepts and first working deliverable", instructions: "Complete the first core learning objective and submit a concise explanation with a link to your working deliverable." },
  { week: 3, title: "Feature implementation and evidence", instructions: "Build the next track deliverable, keep the work in version control, and describe one issue you solved." },
  { week: 4, title: "Integration, quality checks, and feedback", instructions: "Connect the parts of your project, run relevant checks, and submit the result with any feedback questions." },
  { week: 5, title: "Capstone build and deployment preparation", instructions: "Prepare your capstone for review. Include setup instructions, test evidence, and any known limitations." },
  { week: 6, title: "Final demonstration and handover", instructions: "Present the completed project, summarize what you learned, and provide a clean handover or portfolio link." },
];

export const trackMilestones: Record<string, MilestoneTemplate[]> = {
  "web-fullstack": [
    { week: 1, title: "React and TypeScript foundations", instructions: "Build typed React components with clear props and state. Submit a small interface and explain the component boundaries." },
    { week: 2, title: "Responsive design system and navigation", instructions: "Create reusable layout styles and a responsive navigation pattern. Check the interface at phone, tablet, and desktop widths." },
    { week: 3, title: "Next.js routes and data loading", instructions: "Implement App Router pages and connect a real or supplied REST endpoint with clear loading, empty, and error states." },
    { week: 4, title: "Forms, validation, and API integration", instructions: "Add a validated form and robust API interaction. Explain how invalid input and failed requests are handled." },
    { week: 5, title: "Persistence and access control", instructions: "Connect database-backed data and an authentication flow. Demonstrate server-side authorization for protected information." },
    { week: 6, title: "Full-stack deployment and handover", instructions: "Deploy the application, provide a working URL, and document setup, environment configuration, and known limitations." },
  ],
  "ai-agents": [
    { week: 1, title: "Model APIs and reliable outputs", instructions: "Call a hosted model from Python, configure secrets safely, validate structured responses, and record a small baseline evaluation set." },
    { week: 2, title: "Document search and grounded answers", instructions: "Prepare a small document collection, compare chunking and retrieval choices, and return answers with source references." },
    { week: 3, title: "Bounded tools and guardrails", instructions: "Add one bounded tool or workflow, validate inputs, handle failures, and require human review for consequential actions." },
    { week: 4, title: "FastAPI service and test design", instructions: "Expose the application through FastAPI, cover core paths, and handle timeouts and provider errors." },
    { week: 5, title: "Evaluation and deployment", instructions: "Measure quality, latency, and token use on a fixed test set; deploy with logs and safe secret handling." },
    { week: 6, title: "AI capstone and technical review", instructions: "Demonstrate a documented AI application with reproducible checks, known limitations, and a concise evaluation report." },
  ],
  "data-science": [
    { week: 1, title: "Problem framing and data quality", instructions: "Define a prediction question and target, inspect a dataset, and document missing values, leakage risks, and assumptions." },
    { week: 2, title: "Exploration and baseline model", instructions: "Use Pandas and visual summaries to understand the data, then build a simple baseline before complex models." },
    { week: 3, title: "Feature engineering and pipelines", instructions: "Prepare features with Scikit-learn pipelines and keep transformations inside the training workflow." },
    { week: 4, title: "Model training and validation", instructions: "Train suitable classification or regression models, choose relevant metrics, and validate with held-out data or cross-validation." },
    { week: 5, title: "Error analysis and interpretation", instructions: "Inspect false positives and missed cases, compare behavior across relevant groups, and explain model limits." },
    { week: 6, title: "Reproducible capstone report", instructions: "Deliver a clean notebook or package, saved evaluation results, and a short report covering performance and next steps." },
  ],
  "data-analytics": [
    { week: 1, title: "Business questions and spreadsheet analysis", instructions: "Translate a business brief into measurable questions; inspect and clean a small dataset in Excel." },
    { week: 2, title: "SQL for business analysis", instructions: "Use filters, joins, aggregations, CASE, and introductory CTEs to answer questions from relational data." },
    { week: 3, title: "Data quality and KPI definitions", instructions: "Check duplicates, missing values, and edge cases; write clear KPI definitions and assumptions." },
    { week: 4, title: "Power Query and BI data models", instructions: "Transform data in Power Query and build a simple star-schema model with appropriate relationships." },
    { week: 5, title: "Power BI measures and reporting", instructions: "Create core DAX measures, select readable visuals, and add filters that support stakeholder questions." },
    { week: 6, title: "Dashboard review and insight brief", instructions: "Present a checked dashboard, explain two evidence-backed findings, and list caveats and recommended follow-up analysis." },
  ],
  "ai-fde": [
    { week: 1, title: "Workflow discovery and success measures", instructions: "Map a supplied or stakeholder workflow, users, constraints, and measurable success criteria." },
    { week: 2, title: "Solution design and data integration", instructions: "Propose a small architecture, identify data and access boundaries, and connect an approved API or dataset." },
    { week: 3, title: "Applied AI prototype", instructions: "Build a scoped AI feature with validated inputs and outputs, fallback behavior, and human review where needed." },
    { week: 4, title: "Evaluation and system integration", instructions: "Create representative tests, assess quality and failure modes, and integrate the feature into a usable service or workflow." },
    { week: 5, title: "Pilot deployment and operations", instructions: "Deploy a pilot; add basic logs and configuration checks, and document a rollback path." },
    { week: 6, title: "Customer demonstration and handover", instructions: "Present the working pilot against agreed measures and provide setup, limitations, support notes, and next steps." },
  ],
  "react-native": [
    { week: 1, title: "React Native and TypeScript foundations", instructions: "Build typed mobile components with React Native and confirm the development app runs on a simulator or device." },
    { week: 2, title: "Mobile layouts and navigation", instructions: "Create responsive mobile screens with tab/stack navigation and accessible touch interactions." },
    { week: 3, title: "State management and API data", instructions: "Use a clear state pattern to load remote data and handle pending, empty, and failure states." },
    { week: 4, title: "Persistence and offline behavior", instructions: "Add local persistence for an appropriate use case and demonstrate how network interruptions are handled." },
    { week: 5, title: "Device capabilities and release preparation", instructions: "Integrate an appropriate device capability, check platform behavior, and prepare a release build." },
    { week: 6, title: "Mobile capstone and handover", instructions: "Demonstrate the working app, share source code and a test build, and document setup and limitations." },
  ],
  flutter: [
    { week: 1, title: "Dart and Flutter widget foundations", instructions: "Build a small Flutter interface and explain the widget tree and state boundaries." },
    { week: 2, title: "Navigation, layouts, and visual theme", instructions: "Create themed screens and navigation that work across common device sizes." },
    { week: 3, title: "State management and API integration", instructions: "Connect a REST endpoint and use a clear Provider or BLoC state flow with visible loading and error handling." },
    { week: 4, title: "Firebase or service integration", instructions: "Connect an approved backend service and demonstrate safe handling of user and application state." },
    { week: 5, title: "Local persistence and release build", instructions: "Add appropriate local caching and prepare a release build with configuration kept out of source control." },
    { week: 6, title: "Cross-platform capstone and handover", instructions: "Demonstrate the app, provide the source and release build, and document setup and known limitations." },
  ],
  "devops-engineering": [
    { week: 1, title: "Linux, Git, and networking foundations", instructions: "Use shell commands, permissions, processes, logs, branches, and pull requests; trace DNS, HTTP, and ports; write setup and troubleshooting notes." },
    { week: 2, title: "Containerize an application", instructions: "Build and run a Docker image, configure environment variables safely, add a health check, and use Docker Compose." },
    { week: 3, title: "CI pipeline with GitHub Actions", instructions: "Run checks on pull requests, build a versioned image, and keep deployment credentials out of source control." },
    { week: 4, title: "Infrastructure as code with Terraform", instructions: "Describe a small cloud environment, inspect a plan before applying, and document state and cleanup practices." },
    { week: 5, title: "Deploy and operate a workload", instructions: "Deploy to the selected cohort environment and practice Kubernetes workload, service, rollout, and health-probe fundamentals." },
    { week: 6, title: "Observability, rollback, and handover", instructions: "Demonstrate the pipeline, inspect logs and service health, document rollback and incident steps, and review security and cost controls." },
  ],
};

export function milestonesForTrack(slug: string): MilestoneTemplate[] {
  return trackMilestones[slug] ?? generic;
}
