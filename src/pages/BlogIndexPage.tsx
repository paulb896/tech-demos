import React from 'react'
import { Link } from 'react-router-dom'
import { articles } from '../data/articles'

export const BlogIndexPage = (): JSX.Element => {
  return (
    <div className="page">
      <header className="hero">
        <div className="heroText">
          <h1 className="title">Blog</h1>
          <p className="subtitle">Thoughts on engineering, agents, and architecture.</p>
          <div className="ctaRow">
            <Link className="button secondary" to="/">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="section">
          <div className="projects">
            {articles.map((article) => (
              <Link key={article.slug} className="projectCard projectCardRow" to={`/blog/${article.slug}`}>
                <div className="projectCardBody">
                  <div className="projectName">{article.title}</div>
                  <div className="projectDesc">{article.date}</div>
                  <div className="projectDesc" style={{ marginTop: '0.5rem' }}>{article.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default BlogIndexPage
