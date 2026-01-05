import React from 'react'
import LinkedInWidget from '../LinkedInWidget'
import { linkedInProfile } from '../profile'
import type { SkillIconKind } from '../SkillIcon'
import { projects } from '../projects'
import { HeroScene, skillLabelByKind } from './CubeHeroScene'

export const HomePage = (): JSX.Element => {
  const [selectedSkill, setSelectedSkill] = React.useState<SkillIconKind | null>(null)
  const [glassTransmission, setGlassTransmission] = React.useState<number>(0.92)

  const selectedSkillLabel = selectedSkill ? skillLabelByKind[selectedSkill] : null

  return (
    <div className="page">
      <header className="hero">
        <div className="heroText">
          <h1 className="title">Backend developer</h1>
          <p className="subtitle">Nearly 20 years of professional experience building reliable web systems.</p>
          <div className="ctaRow">
            <a className="button secondary" href="https://github.com/paulb896" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>

          <LinkedInWidget {...linkedInProfile} variant="hero" />
        </div>

        <div>
          <div className="hero3d" aria-label="3D rotating cube demo">
            <HeroScene
              selectedSkill={selectedSkill}
              onSelectSkill={setSelectedSkill}
              transmission={glassTransmission}
              onChangeTransmission={setGlassTransmission}
            />
          </div>

          <div className="skillPanel" role="status" aria-live="polite">
            <div className="skillPanelTitle">Selected skill</div>
            <div className="skillPanelValue">{selectedSkillLabel ?? 'Click a cube face icon'}</div>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="section" id="about">
          <h2>About</h2>
          <p>
            I focus on backend architecture, performance, reliability, and developer experience. I like clear
            interfaces, pragmatic monitoring, and systems that fail gracefully.
          </p>
        </section>

        <section className="section" id="projects">
          <h2>Projects</h2>
          <div className="projects">
            {projects.map((p) => (
              <a key={p.name} className="projectCard" href={`#/projects/${p.slug}`}>
                <div className="projectName">{p.name}</div>
                <div className="projectDesc">{p.description}</div>
                {p.tags?.length ? <div className="projectTags">{p.tags.join(' • ')}</div> : null}
              </a>
            ))}
          </div>
        </section>

        <section className="section" id="contact">
          <h2>Contact</h2>
          <p>Add your email, LinkedIn, and any preferred contact links here.</p>
        </section>
      </main>
    </div>
  )
}
