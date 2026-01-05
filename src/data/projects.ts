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
    slug: 'project-two',
    name: 'Project Two',
    description: 'Another one-liner describing impact, performance, or architecture.',
    githubUrl: 'https://github.com/<you>/<repo>',
    tags: ['Go', 'Postgres']
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
