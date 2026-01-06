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
    slug: 'llm-typescript-codebase-embeddings',
    name: 'LLM TypeScript Codebase Embeddings',
    description: 'Parse and load a TypeScript codebase into a Postgres vector DB for use in a RAG setup.',
    githubUrl: 'https://github.com/paulb896/llm-typescript-codebase-embeddings',
    tags: ['RAG', 'Embeddings', 'Postgres', 'TypeScript'],
    liveUrl: 'https://paulb896.github.io/llm-typescript-codebase-embeddings/',
    screenshotUrl: `${import.meta.env.BASE_URL}project-screenshots/llm-typescript-codebase-embeddings.jpeg`,
    techUsed: [
      'TypeScript',
      'Docker',
      'Docker Compose',
      'Postgres',
      'Ollama'
    ],
    highlights: [
      'Indexes a TypeScript codebase into a Postgres vector DB.',
      'Searches indexed code and can generate AI-assisted answers from results.',
      'Includes a web server and Swagger docs for exploring the API.',
      'Runs locally with Docker + Docker Compose and supports file uploads.'
    ],
  }
]

export const workProjects: Project[] = [
  {
    slug: 'ea-skate-webstore',
    name: 'Skate Webstore (Electronic Arts)',
    description:
      'Public-facing web storefront for the Skate game: browse and purchase add-ons/currency, redeem codes, and manage loyalty rewards.',
    liveUrl: 'https://store.ea.com/skate',
    screenshotUrl: `${import.meta.env.BASE_URL}project-screenshots/ea-skate-webstore.png`,
    tags: ['Work', 'E-commerce', 'Gaming'],
    techUsed: ['Next.js', 'TypeScript', 'Mercurius GraphQL', 'Kubernetes'],
    highlights: [
      'Supports direct web purchases (currency packs, add-ons, and season passes) with a web bonus incentive.',
      'Includes code redemption flows for in-game items and entitlements.',
      'Implements a loyalty points program with reward redemption across seasons.',
      'Production-grade operations: scalable backend APIs and infrastructure for high-traffic storefront workloads.'
    ]
  },
  {
    slug: 'ea-battlefield-webstore',
    name: 'Battlefield Webstore (Electronic Arts)',
    description:
      'Public-facing web storefront for Battlefield: purchase in-game currency and bundles, and access season pass offerings.',
    liveUrl: 'https://store.ea.com/battlefield/en',
    screenshotUrl: `${import.meta.env.BASE_URL}project-screenshots/ea-battlefield-webstore.png`,
    tags: ['Work', 'E-commerce', 'Gaming'],
    techUsed: ['Next.js', 'TypeScript', 'Mercurius GraphQL', 'Kubernetes'],
    highlights: [
      'Supports direct web purchases of in-game currency (Battlefield Coins) and bundles.',
      'Includes battle pass and season-related offerings surfaced in a dedicated storefront UI.',
      'Integrates account-based flows (sign-in) and purchase/license terms for digital content.',
      'Built to support a global audience with localization and links to support channels.'
    ]
  },
  {
    slug: 'ea-apex-webstore',
    name: 'Apex Legends Webstore (Electronic Arts)',
    description:
      'Public-facing web storefront for Apex Legends: browse and purchase in-game currency and offers, and access season-related content.',
    liveUrl: 'http://store.ea.com/apex-legends',
    screenshotUrl: `${import.meta.env.BASE_URL}project-screenshots/ea-apex-webstore.png`,
    tags: ['Work', 'E-commerce', 'Gaming'],
    techUsed: ['Next.js', 'TypeScript', 'Mercurius GraphQL', 'Kubernetes'],
    highlights: [
      'Supports direct web purchases of in-game currency and time-boxed offers.',
      'Includes account-based flows (sign-in) and purchase/license terms for digital content.',
      'Designed for a global audience with localization and support links.',
      'Built on the same storefront platform and backend stack as the Skate and Battlefield webstores.'
    ]
  }
]

export const allProjects: Project[] = [...projects, ...workProjects]
