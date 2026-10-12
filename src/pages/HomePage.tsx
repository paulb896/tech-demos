import React from 'react'
import { Link } from 'react-router-dom'
import LinkedInWidget from '../components/LinkedInWidget'
import { linkedInProfile } from '../data/profile'
import { projects, workProjects } from '../data/projects'
import '../consulting.css'

export const HomePage = (): JSX.Element => {
  return (
    <div className="c-root">
      <div className="c-bgGlow" aria-hidden="true" />

      <nav className="c-nav" aria-label="Portfolio navigation">
        <a href="#top" className="c-logo">Paul Beauchamp<span>.</span></a>
        <div className="c-navLinks">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#work-projects">Work</a>
          <Link to="/">Consulting</Link>
          <Link to="/blog">Blog</Link>
          <a href="#contact" className="c-btn c-btnPrimary c-btnSm">Contact</a>
        </div>
      </nav>

      <div className="page portfolioPage">
      <header className="hero" id="top">
        <div className="heroText">
          <h1 className="title">Backend Software <span className="c-grad">Architect</span></h1>
          <p className="subtitle">18 years of professional experience building reliable web systems.</p>
          <div className="ctaRow">
            <a className="button c-btn c-btnGhost" href="https://github.com/paulb896/tech-demos" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <Link className="button c-btn c-btnGhost" to="/agent-prompts">
              Agent Prompts that Built This Site
            </Link>
            <Link className="button c-btn c-btnGhost" to="/blog">
              Blog
            </Link>
          </div>

          <LinkedInWidget {...linkedInProfile} variant="hero" />
        </div>
      </header>

      <main className="content">
        <section className="section c-glass" id="about">
          <h2>About</h2>
          <p>
            Focusing on building scalable and maintainable backend systems using modern technologies and best practices that
            solve real-world user problems.
          </p>
        </section>

        <section className="section c-glass" id="projects">
          <h2>Personal Projects</h2>
          <div className="projects">
            {projects.map((p) => (
              <Link key={p.name} className="projectCard projectCardRow projectCardCompact" to={`/projects/${p.slug}`}>
                <div className="projectCardMedia" aria-hidden="true">
                  {p.screenshotUrl ? (
                    <img className="projectCardImage" src={p.screenshotUrl} alt="" loading="lazy" />
                  ) : (
                    <div className="projectCardPlaceholder" />
                  )}
                </div>
                <div className="projectCardBody">
                  <div className="projectName">{p.name}</div>
                  <div className="projectDesc">{p.description}</div>
                  {p.tags?.length ? <div className="projectTags">{p.tags.join(' • ')}</div> : null}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section c-glass" id="work-projects">
          <h2>Work Projects</h2>
          <div className="projects">
            {workProjects.map((p) => (
              <Link key={p.name} className="projectCard" to={`/projects/${p.slug}`}>
                {p.screenshotUrl ? (
                  <div className="projectCardMedia" aria-hidden="true">
                    <img className="projectCardImage" src={p.screenshotUrl} alt="" loading="lazy" />
                  </div>
                ) : null}
                <div className="projectCardBody">
                  <div className="projectName">{p.name}</div>
                  <div className="projectDesc">{p.description}</div>
                  {p.tags?.length ? <div className="projectTags">{p.tags.join(' • ')}</div> : null}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section c-glass" id="contact">
          <h2>Contact</h2>
          <LinkedInWidget {...linkedInProfile} variant="section" />
        </section>
      </main>

      <footer className="c-footer">
        © {new Date().getFullYear()} Paul Beauchamp · <Link to="/">Consulting</Link> · <Link to="/blog">Blog</Link> ·{' '}
        <Link to="/agent-prompts">How this site was built</Link>
      </footer>
      </div>
    </div>
  )
}
