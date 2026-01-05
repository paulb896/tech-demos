import React from 'react'
import { useParams } from 'react-router-dom'
import { projects } from './projects'

const ProjectPage = (): JSX.Element => {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

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
        {project.githubUrl ? (
          <div className="ctaRow">
            <a className="button" href={project.githubUrl} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
        ) : null}
      </header>
    </div>
  )
}

export default ProjectPage
