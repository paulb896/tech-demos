import React from 'react'
import { Link } from 'react-router-dom'
import LinkedInWidget from '../components/LinkedInWidget'
import { linkedInProfile } from '../data/profile'
import type { SkillIconKind } from '../components/SkillIcon'
import { projects, workProjects } from '../data/projects'
import { HeroScene, skillLabelByKind } from '../components/CubeHeroScene'

const skillDetailsByKind: Record<SkillIconKind, { years: number | null; description: string }> = {
  database: {
    years: 18,
    description: 'Designing schemas, writing performant queries, tuning indexes, and operating data stores in production.'
  },
  node: {
    years: 15,
    description: 'Building scalable backend services, APIs, and tooling with Node.js and modern TypeScript practices.'
  },
  containers: {
    years: 12,
    description: 'Packaging services with Docker, defining repeatable builds, and shipping reliable runtime images.'
  },
  kubernetes: {
    years: 5,
    description: 'Deploying and operating services with Kubernetes primitives, CI/CD, and production-grade observability.'
  },
  graphql: {
    years: 5,
    description: 'Designing GraphQL schemas, resolvers, and gateway patterns with performance and ergonomics in mind.'
  },
  code: {
    years: 18,
    description: 'Writing maintainable codebases with strong architecture, testing discipline, and pragmatic engineering.'
  }
}

type SkillGaugeProps = {
  years: number | null
  maxYears: number
}

const SkillGauge = ({ years, maxYears }: SkillGaugeProps): JSX.Element => {
  const safeYears = years === null ? null : Math.max(0, Math.min(maxYears, years))
  const ratio = safeYears === null ? 0 : safeYears / Math.max(1, maxYears)
  const percent = Math.round(ratio * 100)

  return (
    <div className="skillGauge" aria-label="Experience gauge">
      <div className="skillGaugeTop">
        <div className="skillGaugeLabel">Experience</div>
        <div className="skillGaugeValue">{safeYears === null ? 'Set years' : `${safeYears} yrs`}</div>
      </div>
      <div className="skillGaugeTrack" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="skillGaugeFill" style={{ width: `${percent}%` }} />
      </div>
      <div className="skillGaugeHint">{safeYears === null ? `Set years in skillDetailsByKind` : `~${percent}% of ${maxYears} yrs scale`}</div>
    </div>
  )
}

export const HomePage = (): JSX.Element => {
  const [selectedSkill, setSelectedSkill] = React.useState<SkillIconKind | null>(null)

  const selectedSkillLabel = selectedSkill ? skillLabelByKind[selectedSkill] : null
  const selectedSkillDetails = selectedSkill ? skillDetailsByKind[selectedSkill] : null
  const hasSelectedSkill = selectedSkillDetails !== null

  return (
    <div className="page">
      <header className="hero">
        <div className="heroText">
          <h1 className="title">Backend Software Architect</h1>
          <p className="subtitle">18 years of professional experience building reliable web systems.</p>
          <div className="ctaRow">
            <a className="button secondary" href="https://github.com/paulb896/tech-demos" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <Link className="button secondary" to="/agent-prompts">
              Agent Prompts that Built This Site
            </Link>
            <Link className="button secondary" to="/blog">
              Blog
            </Link>
          </div>

          <LinkedInWidget {...linkedInProfile} variant="hero" />
        </div>

        <div>
          <div className="hero3d" aria-label="3D rotating cube demo">
            <HeroScene
              selectedSkill={selectedSkill}
              onSelectSkill={setSelectedSkill}
            />
          </div>

          <div className={hasSelectedSkill ? 'skillPanel skillPanelSelected' : 'skillPanel'} role="status" aria-live="polite">
            <div className="skillPanelTitle">Selected skill</div>
            <div className="skillPanelValue">{selectedSkillLabel ?? 'Click a cube face icon'}</div>

            <div
              className={selectedSkillDetails ? 'skillPanelBody' : 'skillPanelBody skillPanelBodyHidden'}
              aria-hidden={selectedSkillDetails ? undefined : true}
            >
              <div className="skillPanelBodyGrid">
                <SkillGauge years={selectedSkillDetails?.years ?? null} maxYears={18} />
                <div className="skillPanelDescCard">
                  <div className="skillPanelDescTitle">What this covers</div>
                  <div className="skillPanelDesc">{selectedSkillDetails?.description ?? ''}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="section" id="about">
          <h2>About</h2>
          <p>
            Focusing on building scalable and maintainable backend systems using modern technologies and best practices that
            solve real-world user problems.
          </p>
        </section>

        <section className="section" id="projects">
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

        <section className="section" id="work-projects">
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

        <div>
          <h2>Contact</h2>
          <LinkedInWidget {...linkedInProfile} variant="section" />
        </div>
      </main>
    </div>
  )
}
