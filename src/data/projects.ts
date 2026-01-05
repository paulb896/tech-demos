export type Project = {
  slug: string
  name: string
  description: string
  githubUrl?: string
  liveUrl?: string
  screenshotUrl?: string
  tags?: string[]
  techUsed?: string[]
  whatILearned?: string[]
  highlights?: string[]
}

export const projects: Project[] = [
  {
    slug: 'request-header-override',
    name: 'Request Header/Query Param Override (Chrome Extension)',
    description:
      'Chrome extension that injects/overrides HTTP request headers and query params for XHR/Fetch requests using declarativeNetRequest dynamic rules.',
    githubUrl: 'https://github.com/paulb896/request-header-override-chrome-extension',
    liveUrl: 'https://chrome.google.com/webstore/detail/request-header-override-m/cfgjehpalgepkcfekgjgmklehchiidgi?hl=en',
    screenshotUrl: `${import.meta.env.BASE_URL}project-screenshots/request-header-override.png`,
    tags: ['Chrome Extension', 'React', 'DevTools', 'declarativeNetRequest'],
    techUsed: ['React', 'TypeScript', 'eslint'],
    highlights: [
      'Allows a user to override headers for outgoing requests (for example, setting trace-enabled: true or X-Akamai-Edgescape headers for debugging).',
      'Overrides can be limited to domains based on a regex pattern to avoid setting headers on requests that could cause issues.',
      'Uses Chrome Extension Manifest V3 to be more secure and remain compatible as V2 is deprecated.',
      'Overrides are stored in browser local storage so they persist across sessions.'
    ],
  },
  {
    slug: 'llm-doc-embeddings',
    name: 'LLM Text Document Embeddings',
    description: 'Parse and load text files into a Postgres vector DB for use in a RAG setup.',
    githubUrl: 'https://github.com/paulb896/llm-doc-embeddings',
    tags: ['RAG', 'Embeddings', 'Postgres', 'TypeScript'],
    liveUrl: 'https://paulb896.github.io/llm-doc-embeddings/',
    screenshotUrl: `${import.meta.env.BASE_URL}project-screenshots/llm-doc-embeddings.jpeg`,
    techUsed: ['TypeScript', 'Postgres', 'Docker', 'Docker Compose', 'Ollama', 'AWS Bedrock'],
    highlights: [
      'Indexes a single document or a directory into a Postgres vector DB.',
      'Searches indexed documents and can generate AI-assisted answers from results.',
      'Includes a web server and Swagger docs for exploring the API.',
      'Supports both CLI workflows and file uploads.'
    ],
  },
  {
    slug: 'project-three',
    name: 'Project Three',
    description: 'A service, tool, or library that highlights your strengths.',
    githubUrl: 'https://github.com/<you>/<repo>',
    tags: ['API', 'Observability']
  },
  {
    slug: 'project-four',
    name: 'Project Four',
    description: 'Something fun: a demo, game, or interesting tech exploration.',
    githubUrl: 'https://github.com/<you>/<repo>',
    tags: ['3D', 'Frontend']
  },
  {
    slug: 'project-five',
    name: 'Project Five',
    description: 'A “boring” but valuable project: automation, tooling, migrations.',
    githubUrl: 'https://github.com/<you>/<repo>',
    tags: ['DevEx', 'CI']
  },
  {
    slug: 'project-six',
    name: 'Project Six',
    description: 'A project with performance wins, scale, or reliability focus.',
    githubUrl: 'https://github.com/<you>/<repo>',
    tags: ['Performance', 'SRE']
  }
]
