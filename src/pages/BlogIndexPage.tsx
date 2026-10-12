import React from 'react'
import { Link } from 'react-router-dom'
import { articles } from '../data/articles'
import '../consulting.css'

export const BlogIndexPage = (): JSX.Element => {
  return (
    <div className="c-root">
      <div className="c-bgGlow" aria-hidden="true" />
      <nav className="c-nav" aria-label="Blog navigation">
        <Link to="/" className="c-logo">Paul Beauchamp<span>.</span></Link>
        <div className="c-navLinks">
          <Link to="/">Consulting</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/blog">Blog</Link>
        </div>
      </nav>

      <div className="page">
        <header className="hero">
          <div className="heroText">
            <h1 className="title">Blog</h1>
            <p className="subtitle">Thoughts on engineering, agents, and architecture.</p>
            <div className="ctaRow">
              <Link className="button c-btn c-btnGhost" to="/">
                Back to Home
              </Link>
            </div>
          </div>
        </header>

        <main className="content">
          <section className="section c-glass">
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

      <footer className="c-footer">
        © {new Date().getFullYear()} Paul Beauchamp · <Link to="/">Consulting</Link> · <Link to="/portfolio">Portfolio</Link>
      </footer>
    </div>
  )
}

export default BlogIndexPage
