export type Project = {
  slug: string
  name: string
  description: string
  githubUrl?: string
  tags?: string[]
}

export const projects: Project[] = [
  {
    slug: 'request-header-override',
    name: 'Request Header/Query Param Override (Chrome Extension)',
    description:
      'Chrome extension that injects/overrides HTTP request headers and query params for XHR/Fetch requests using declarativeNetRequest dynamic rules.',
    githubUrl: 'https://github.com/paulb896/request-header-override-chrome-extension',
    tags: ['Chrome Extension', 'React', 'DevTools', 'declarativeNetRequest']
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
