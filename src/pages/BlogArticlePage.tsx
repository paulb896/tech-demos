import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { articles } from '../data/articles'
import '../consulting.css'

export const BlogArticlePage = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>()
  const article = articles.find((a) => a.slug === slug)

  if (!article) {
    return (
      <div className="c-root">
        <div className="c-bgGlow" aria-hidden="true" />
        <div className="page">
          <header className="hero">
            <div className="heroText">
              <h1 className="title">Article Not Found</h1>
              <div className="ctaRow">
                <Link className="button c-btn c-btnGhost" to="/blog">
                  Back to Blog
                </Link>
              </div>
            </div>
          </header>
        </div>
        <footer className="c-footer">
          © {new Date().getFullYear()} Paul Beauchamp · <Link to="/">Consulting</Link> · <Link to="/portfolio">Portfolio</Link> ·{' '}
          <Link to="/blog">Blog</Link>
        </footer>
      </div>
    )
  }

  return (
    <div className="c-root">
      <div className="c-bgGlow" aria-hidden="true" />
      <nav className="c-nav" aria-label="Blog article navigation">
        <Link to="/" className="c-logo">Paul Beauchamp<span>.</span></Link>
        <div className="c-navLinks">
          <Link to="/">Consulting</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/blog" className="c-btn c-btnGhost c-btnSm">All posts</Link>
        </div>
      </nav>

      <div className="page">
        <header className="hero">
          <div className="heroText">
            <h1 className="title">{article.title}</h1>
            <p className="subtitle" style={{ opacity: 0.8, marginBottom: '0.5rem' }}>{article.date}</p>
            <p className="subtitle">{article.description}</p>
            <div className="ctaRow">
              <Link className="button c-btn c-btnGhost" to="/blog">
                Back to Blog
              </Link>
              <Link className="button c-btn c-btnGhost" to="/">
                Back to Home
              </Link>
            </div>
          </div>
        </header>

        <main className="content">
          {article.content}
        </main>
      </div>

      <footer className="c-footer">
        © {new Date().getFullYear()} Paul Beauchamp · <Link to="/">Consulting</Link> · <Link to="/portfolio">Portfolio</Link> ·{' '}
        <Link to="/blog">Blog</Link>
      </footer>
    </div>
  )
}

export default BlogArticlePage
