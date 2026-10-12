export const contactConfig = {
  email: 'paulb896@gmail.com',
  linkedInUrl: 'https://www.linkedin.com/in/paul-g-beauchamp/'
}

/**
 * Google Form backing the interest form. Submissions land in the linked Google Sheet.
 * - formId: the long ID from the form's public URL: docs.google.com/forms/d/e/<formId>/viewform
 * - entries: the `entry.NNNN` ID for each question (from "Get pre-filled link").
 * Leave formId empty to fall back to the email compose options.
 */
export const googleFormConfig = {
  formId: '1FAIpQLSe3MdQGYBsEagflxv-04qLPhE7c1Fo_-kTVpib9dyQjhMh4Ng',
  entries: {
    name: 'entry.1209507863',
    email: 'entry.1786042993',
    company: 'entry.272765007',
    role: 'entry.2028978430',
    areas: 'entry.833327544',
    timeline: 'entry.137574446',
    budget: 'entry.1503779202',
    message: 'entry.44137106'
  }
}

export type ExpertiseArea = {
  id: string
  icon: string
  title: string
  years: string
  outcome: string
  bullets: string[]
  tech: string[]
  relatedProjectSlugs?: string[]
  featured?: boolean
}

export const expertiseAreas: ExpertiseArea[] = [
  {
    id: 'ai',
    icon: '✦',
    title: 'AI Workflows & LLM Pipelines',
    years: 'Current focus',
    featured: true,
    outcome: 'Turn AI hype into production workflows that save your team real hours, and that you can measure, trust, and maintain.',
    bullets: [
      'RAG systems over your docs, tickets, and codebases',
      'Embedding pipelines and vector search on Postgres (pgvector)',
      'Agentic coding workflows and AI-assisted SDLC adoption',
      'Evaluation harnesses, guardrails, and cost controls',
      'Local (Ollama) vs. hosted (AWS Bedrock, OpenAI, Gemini) model strategy'
    ],
    tech: ['TypeScript', 'Postgres + pgvector', 'Ollama', 'AWS Bedrock', 'Agents', 'Evals'],
    relatedProjectSlugs: ['llm-doc-embeddings', 'llm-typescript-codebase-embeddings']
  },
  {
    id: 'web',
    icon: '◧',
    title: 'Websites & Web Apps',
    years: '18 yrs',
    outcome: 'Fast, accessible, SEO-friendly sites and apps, from marketing pages to full product frontends.',
    bullets: ['Greenfield builds and modernization', 'Performance and Core Web Vitals', 'Static hosting, CDNs, and deploy pipelines'],
    tech: ['React', 'TypeScript', 'Vite', 'Node.js', 'Chrome Extensions']
  },
  {
    id: 'api',
    icon: '⇄',
    title: 'APIs & Integrations',
    years: '18 yrs',
    outcome: 'Well-designed APIs your partners and frontends love to use, documented, versioned, and observable.',
    bullets: ['REST and GraphQL schema design', 'Third-party integrations and webhooks', 'AuthN/AuthZ, rate limiting, and API gateways'],
    tech: ['Node.js', 'GraphQL', 'OpenAPI / Swagger', 'gRPC']
  },
  {
    id: 'events',
    icon: '⚡',
    title: 'Event-Driven Systems',
    years: '10+ yrs',
    outcome: 'Decoupled, resilient systems that scale with load and recover cleanly when things fail.',
    bullets: ['Queues, streams, and pub/sub architecture', 'Idempotency, retries, and dead-letter strategies', 'Async workflows and sagas'],
    tech: ['Kafka', 'SQS / SNS', 'RabbitMQ', 'Redis Streams']
  },
  {
    id: 'data',
    icon: '◉',
    title: 'Databases & Data Modeling',
    years: '18 yrs',
    outcome: 'Schemas and queries that stay fast as data grows, with migrations you are not afraid to run.',
    bullets: ['Schema design and normalization trade-offs', 'Query tuning and indexing', 'Migrations, replication, and backups'],
    tech: ['Postgres', 'MySQL', 'Redis', 'DynamoDB', 'MongoDB']
  },
  {
    id: 'infra',
    icon: '☁',
    title: 'Infrastructure & DevOps',
    years: '12+ yrs',
    outcome: 'Repeatable infrastructure and CI/CD so shipping is boring, and production is observable.',
    bullets: ['Containerization and Kubernetes', 'CI/CD pipelines and infrastructure as code', 'Monitoring, logging, tracing, and alerting'],
    tech: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'GitHub Actions']
  },
  {
    id: 'process',
    icon: '↻',
    title: 'Agile & Lean Delivery',
    years: '15 yrs',
    outcome: 'Teams that ship smaller, more often, and with less stress, focused on outcomes over output.',
    bullets: ['Flow, WIP limits, and value-stream mapping', 'Right-sized Scrum / Kanban practices', 'Planning, estimation, and roadmap hygiene'],
    tech: ['Scrum', 'Kanban', 'Lean', 'DORA metrics']
  },
  {
    id: 'arch',
    icon: '⌘',
    title: 'Architecture & Tech Leadership',
    years: '18 yrs',
    outcome: 'A clear technical direction and a second set of senior eyes on your biggest decisions.',
    bullets: ['Architecture and codebase reviews', 'Build vs. buy and vendor evaluation', 'Mentoring and engineering standards'],
    tech: ['System design', 'ADRs', 'Code review', 'Mentoring']
  }
]

export type EngagementModel = {
  name: string
  duration: string
  summary: string
  includes: string[]
  highlight?: boolean
}

export const engagementModels: EngagementModel[] = [
  {
    name: 'Discovery & Audit',
    duration: '1–2 weeks',
    summary: 'A focused review of your architecture, codebase, infrastructure, or delivery process.',
    includes: ['Stakeholder interviews', 'Written findings report', 'Prioritized roadmap']
  },
  {
    name: 'AI Pipeline Accelerator',
    duration: '3–6 weeks',
    summary: 'Go from "we should use AI" to a working, evaluated pipeline on your own data.',
    includes: ['Use-case selection', 'Production-ready prototype', 'Evals and cost model', 'Team handoff'],
    highlight: true
  },
  {
    name: 'Build Sprint',
    duration: 'Project-based',
    summary: 'Hands-on delivery of a website, API, event system, or infrastructure project.',
    includes: ['Scoped milestones', 'Weekly demos', 'Docs and handoff']
  },
  {
    name: 'Fractional Tech Lead',
    duration: 'Monthly retainer',
    summary: 'Ongoing senior guidance for teams without, or in need of support for, a tech lead.',
    includes: ['Architecture decisions', 'Code reviews', 'Process coaching']
  }
]

export const processSteps = [
  { title: 'Intro call', text: 'A free 30-minute chat about your goals, constraints, and whether I am a good fit.' },
  { title: 'Assessment', text: 'I dig into the current state: code, infrastructure, team, and process.' },
  { title: 'Proposal', text: 'A clear scope, timeline, and fixed or capped pricing. No surprises.' },
  { title: 'Delivery', text: 'Iterative work with frequent demos so you see progress every week.' },
  { title: 'Handoff', text: 'Docs, knowledge transfer, and a team that can own it going forward.' }
]

export const faqs = [
  {
    q: 'What size of business do you work with?',
    a: 'Startups through established companies. The sweet spot is teams that need senior backend, AI, or delivery expertise without a full-time hire.'
  },
  {
    q: 'How is pricing structured?',
    a: 'Audits and accelerators are fixed-price. Build work is milestone-based, and fractional leadership is a monthly retainer. Get in touch for a quote tailored to your scope.'
  },
  {
    q: 'Can you work with our existing team?',
    a: 'Yes. Most engagements are collaborative: pairing, reviewing, and leaving your team stronger rather than dependent on me.'
  },
  {
    q: 'Do you work remotely?',
    a: 'Yes. I am based in the Vancouver area (Pacific Time) and work remotely with teams across North America.'
  },
  {
    q: 'What is your availability?',
    a: 'I take on a limited number of select engagements at a time. Reach out early so we can plan around your timeline.'
  }
]

export const timelineOptions = ['ASAP', 'Within 1 month', '1–3 months', 'Just exploring']
export const budgetOptions = ['< $5k', '$5k–$15k', '$15k–$50k', '$50k+', 'Not sure yet']
