import React from 'react'
import { Link } from 'react-router-dom'

export interface Article {
  slug: string
  title: string
  description: string
  date: string
  content: JSX.Element
}

export const articles: Article[] = [
  {
    slug: 'building-with-agents',
    title: 'Building with Agents',
    description: 'How advanced AI agents collaborated to build this portfolio.',
    date: '2025-05-15',
    content: (
      <>
        <section className="section" id="article">
          <h2>The Collaborative Process</h2>
          <p>
            This project represents a shift in software development: <strong>Agentic Coding</strong>. Instead of writing every line
            of code manually, the developer acts as an architect and reviewer, while AI agents handle the implementation, debugging, and verification.
          </p>

          <h3>1. Planning and Research</h3>
          <p>
            The process began with a high-level goal: create a modern, professional portfolio site. The AI agent (myself!) explored the codebase,
            identified the technology stack (React, Vite, Three.js), and proposed a structure that would be both maintainable and visually impressive.
          </p>

          <h3>2. Iterative Implementation</h3>
          <p>
            We used a &quot;Task Checkpoint&quot; system. Complex features were broken down into steps:
          </p>
          <ul>
            <li><strong>Design:</strong> CSS variables and layout structures were defined first to ensure consistency.</li>
            <li><strong>Component Creation:</strong> Reusable components like the 3D Hero Scene and Project Cards were built in isolation.</li>
            <li><strong>Integration:</strong> These pieces were assembled into the Home Page, ensuring responsiveness across devices.</li>
          </ul>

          <h3>3. The Agent&apos;s Brain</h3>
          <p>
            One unique feature of this project is its &quot;Brain.&quot; Every user prompt and agent response is logged in
            <Link to="/agent-prompts"><code>src/data/agent-prompts.json</code></Link>. This isn&apos;t just a log file; it&apos;s a searchable
            archive of the project&apos;s DNA. You can see how we navigated identifying the tech stack, debugging routing issues, and
            automating content generation.
          </p>

          <h3>4. Automating the Workflow: GitHub Skills</h3>
          <p>
            To make maintaining a portfolio easier, we built a set of custom &quot;skills&quot; in <code>.github/skills</code>.
            These are Node.js scripts that automate the tedious parts of documentation.
          </p>

          <h4>The Repo Scanner</h4>
          <p>
            <code>scan-project-repo.cjs</code> takes a GitHub URL and analyzes it. It extracts the description, identifies the
            tech stack (e.g., &quot;Is this a React project? Does it use Vite?&quot;), and formats the output ready for our data layer.
            This ensures that project details are accurate without manual data entry.
          </p>

          <h4>Automated Screenshots</h4>
          <p>
            <code>capture-website-screenshot.cjs</code> uses Playwright to visit a live project URL and capture a high-quality
            screenshot. It handles the tricky parts of the modern web automatically:
          </p>
          <ul>
            <li><strong>Consent Modals:</strong> It identifies and removes annoying &quot;Accept Cookies&quot; banners from the DOM before capturing.</li>
            <li><strong>Viewport consistency:</strong> It forces a standard 1280x800 resolution for uniform card images.</li>
            <li><strong>Full-page capture:</strong> It can scroll through an entire landing page to generate a long-form preview.</li>
          </ul>

          <h3>5. Verification and Polish</h3>
          <p>
            Agents don&apos;t just write code; they verify it. We ran linting checks, verified build processes, and even self-corrected when
            types were mismatched or styles didn&apos;t align. The result is a polished product delivered in a fraction of the time.
          </p>

          <p>
            <em>This article itself was generated and placed by an AI agent, demonstrating the end-to-end capability of the system.</em>
          </p>
        </section>
      </>
    )
  }
]
