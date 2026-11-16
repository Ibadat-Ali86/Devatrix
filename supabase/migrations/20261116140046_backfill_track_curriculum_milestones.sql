begin;

-- Bring only pristine legacy milestone rows in line with each track syllabus.
-- Submitted, reviewed, or otherwise edited learner work is never overwritten.
with curriculum(track_slug, week_number, title, instructions) as (
  values
    ('web-fullstack', 1, 'React and TypeScript foundations', 'Build typed React components with clear props and state. Submit a small interface and explain the component boundaries.'),
    ('web-fullstack', 2, 'Responsive design system and navigation', 'Create reusable layout styles and a responsive navigation pattern. Check phone, tablet, and desktop widths.'),
    ('web-fullstack', 3, 'Next.js routes and data loading', 'Implement App Router pages and connect a REST endpoint with loading, empty, and error states.'),
    ('web-fullstack', 4, 'Forms, validation, and API integration', 'Add a validated form and robust API interaction. Explain how invalid input and failed requests are handled.'),
    ('web-fullstack', 5, 'Persistence and access control', 'Connect database-backed data and authentication. Demonstrate server-side authorization for protected information.'),
    ('web-fullstack', 6, 'Full-stack deployment and handover', 'Deploy the application, provide a working URL, and document setup and known limitations.'),
    ('ai-agents', 1, 'Model APIs and reliable outputs', 'Call a hosted model from Python, configure secrets safely, validate structured responses, and record a baseline evaluation set.'),
    ('ai-agents', 2, 'Document search and grounded answers', 'Prepare a document collection, compare retrieval choices, and return answers with source references.'),
    ('ai-agents', 3, 'Bounded tools and guardrails', 'Add one bounded tool, validate inputs, handle failures, and require human review for consequential actions.'),
    ('ai-agents', 4, 'FastAPI service and test design', 'Expose the application through FastAPI, cover core paths, and handle timeouts and provider errors.'),
    ('ai-agents', 5, 'Evaluation and deployment', 'Measure quality, latency, and token use on a fixed set; deploy with logs and safe secret handling.'),
    ('ai-agents', 6, 'AI capstone and technical review', 'Demonstrate a documented AI application with reproducible checks, known limitations, and an evaluation report.'),
    ('data-science', 1, 'Problem framing and data quality', 'Define a prediction target, inspect a dataset, and document missing values, leakage risks, and assumptions.'),
    ('data-science', 2, 'Exploration and baseline model', 'Use Pandas and visual summaries to understand the data, then build a simple baseline.'),
    ('data-science', 3, 'Feature engineering and pipelines', 'Prepare features with Scikit-learn pipelines and keep transformations inside the training workflow.'),
    ('data-science', 4, 'Model training and validation', 'Train suitable models, choose relevant metrics, and validate with held-out data or cross-validation.'),
    ('data-science', 5, 'Error analysis and interpretation', 'Inspect false positives and missed cases, compare behavior across relevant groups, and explain model limits.'),
    ('data-science', 6, 'Reproducible capstone report', 'Deliver a clean notebook or package, evaluation results, and a short report covering performance and next steps.'),
    ('data-analytics', 1, 'Business questions and spreadsheet analysis', 'Translate a business brief into measurable questions; inspect and clean a small dataset in Excel.'),
    ('data-analytics', 2, 'SQL for business analysis', 'Use filters, joins, aggregations, CASE, and introductory CTEs to answer relational data questions.'),
    ('data-analytics', 3, 'Data quality and KPI definitions', 'Check duplicates, missing values, and edge cases; write clear KPI definitions and assumptions.'),
    ('data-analytics', 4, 'Power Query and BI data models', 'Transform data in Power Query and build a simple star-schema model with appropriate relationships.'),
    ('data-analytics', 5, 'Power BI measures and reporting', 'Create core DAX measures, select readable visuals, and add filters for stakeholder questions.'),
    ('data-analytics', 6, 'Dashboard review and insight brief', 'Present a checked dashboard, explain two evidence-backed findings, and list caveats and follow-up analysis.'),
    ('ai-fde', 1, 'Workflow discovery and success measures', 'Map a supplied or stakeholder workflow, users, constraints, and measurable success criteria.'),
    ('ai-fde', 2, 'Solution design and data integration', 'Propose a small architecture, identify data boundaries, and connect an approved API or dataset.'),
    ('ai-fde', 3, 'Applied AI prototype', 'Build a scoped AI feature with validated inputs and outputs, fallback behavior, and human review where needed.'),
    ('ai-fde', 4, 'Evaluation and system integration', 'Create representative tests, assess failure modes, and integrate the feature into a usable workflow.'),
    ('ai-fde', 5, 'Pilot deployment and operations', 'Deploy a pilot, add basic logs and configuration checks, and document a rollback path.'),
    ('ai-fde', 6, 'Customer demonstration and handover', 'Present the pilot against agreed measures and provide setup, limitations, support notes, and next steps.'),
    ('react-native', 1, 'React Native and TypeScript foundations', 'Build typed mobile components and confirm the development app runs on a simulator or device.'),
    ('react-native', 2, 'Mobile layouts and navigation', 'Create responsive mobile screens with tab or stack navigation and accessible touch interactions.'),
    ('react-native', 3, 'State management and API data', 'Load remote data with a clear state pattern and handle pending, empty, and failure states.'),
    ('react-native', 4, 'Persistence and offline behavior', 'Add local persistence for an appropriate use case and show how network interruptions are handled.'),
    ('react-native', 5, 'Device capabilities and release preparation', 'Integrate an appropriate device capability, check platform behavior, and prepare a release build.'),
    ('react-native', 6, 'Mobile capstone and handover', 'Demonstrate the app, share source and a test build, and document setup and limitations.'),
    ('flutter', 1, 'Dart and Flutter widget foundations', 'Build a Flutter interface and explain the widget tree and state boundaries.'),
    ('flutter', 2, 'Navigation, layouts, and visual theme', 'Create themed screens and navigation that work across common device sizes.'),
    ('flutter', 3, 'State management and API integration', 'Connect a REST endpoint and use a clear Provider or BLoC state flow with loading and error handling.'),
    ('flutter', 4, 'Firebase or service integration', 'Connect an approved backend service and demonstrate safe handling of user and application state.'),
    ('flutter', 5, 'Local persistence and release build', 'Add suitable local caching and prepare a release build with configuration kept out of source control.'),
    ('flutter', 6, 'Cross-platform capstone and handover', 'Demonstrate the app, provide source and release build, and document setup and limitations.'),
    ('devops-engineering', 1, 'Linux, Git, and networking foundations', 'Practice shell commands, logs, branches, DNS, HTTP, and ports; write setup and troubleshooting notes.'),
    ('devops-engineering', 2, 'Containerize an application', 'Build a Docker image, configure environment variables safely, add a health check, and use Compose.'),
    ('devops-engineering', 3, 'CI pipeline with GitHub Actions', 'Run checks on pull requests, build a versioned image, and keep deployment credentials out of source control.'),
    ('devops-engineering', 4, 'Infrastructure as code with Terraform', 'Describe a small cloud environment, inspect plans before applying, and document state and cleanup.'),
    ('devops-engineering', 5, 'Deploy and operate a workload', 'Deploy to the cohort environment and practice Kubernetes workload, rollout, and health-probe fundamentals.'),
    ('devops-engineering', 6, 'Observability, rollback, and handover', 'Demonstrate the pipeline, inspect service health, document rollback steps, and review security and cost controls.')
)
update public.internship_milestones milestone
set title = curriculum.title,
    instructions = curriculum.instructions,
    updated_at = now()
from public.internship_enrollments enrollment, curriculum
where enrollment.id = milestone.enrollment_id
  and curriculum.track_slug = enrollment.track_slug
  and curriculum.week_number = milestone.week_number
  and milestone.status = 'upcoming'
  and milestone.submitted_at is null
  and milestone.submission_url is null
  and milestone.learner_notes is null
  and milestone.reviewer_feedback is null;

commit;
