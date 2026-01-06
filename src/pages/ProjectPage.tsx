import React from 'react'
import { useParams } from 'react-router-dom'
import { allProjects } from '../data/projects'
import type { SkillIconKind } from '../components/SkillIcon'
import { HeroScene } from '../components/CubeHeroScene'

const ProjectPage = (): JSX.Element => {
  const { slug } = useParams()
  const project = allProjects.find((p) => p.slug === slug)

  const [selectedSkill, setSelectedSkill] = React.useState<SkillIconKind | null>(null)
  const [glassTransmission, setGlassTransmission] = React.useState<number>(0.92)

  if (!project) {
    return (
      <div className="page">
        <div className="content">
          <section className="section">
            <h2>Project not found</h2>
            <p>
              <a className="button" href="#/">Back to home</a>
            </p>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="projectHeader">
        <a className="button secondary" href="#/">← Home</a>
        <h1 className="projectTitle">{project.name}</h1>
        <p className="projectSubtitle">{project.description}</p>
        {project.tags?.length ? <div className="projectTags">{project.tags.join(' • ')}</div> : null}
        {project.githubUrl || project.liveUrl ? (
          <div className="ctaRow">
            {project.githubUrl ? (
              <a className="button" href={project.githubUrl} target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            ) : null}
            {project.liveUrl ? (
              <a className="button secondary" href={project.liveUrl} target="_blank" rel="noreferrer">
                View Live App
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="pageCube" aria-label="3D rotating cube demo">
          <HeroScene
            selectedSkill={selectedSkill}
            onSelectSkill={setSelectedSkill}
            transmission={glassTransmission}
            onChangeTransmission={setGlassTransmission}
          />
        </div>
      </header>

      <main className="content">
        {project.highlights?.length ? (
          <section className="section">
            <h2>Highlights</h2>
            <ul className="projectList">
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.screenshotUrl ? (
          <section className="section">
            <h2>Screenshot</h2>
            <div className="projectScreenshotFrame">
              <img className="projectScreenshotImage" src={project.screenshotUrl} alt={`${project.name} screenshot`} />
            </div>
          </section>
        ) : null}

        {project.techUsed?.length ? (
          <section className="section">
            <h2>Tech used</h2>
            <div className="projectChips">
              {project.techUsed.map((tech) => (
                <span key={tech} className="projectChip">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {project.whatILearned?.length ? (
          <section className="section">
            <h2>What I learned</h2>
            <ul className="projectList">
              {project.whatILearned.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

      </main>
    </div>
  )
}

export default ProjectPage
