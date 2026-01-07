import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { articles } from '../data/articles'

export const BlogArticlePage = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>()
  const article = articles.find((a) => a.slug === slug)

  if (!article) {
    return (
      <div className="page">
        <header className="hero">
          <div className="heroText">
            <h1 className="title">Article Not Found</h1>
            <div className="ctaRow">
              <Link className="button secondary" to="/blog">
                Back to Blog
              </Link>
            </div>
          </div>
        </header>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="heroText">
          <h1 className="title">{article.title}</h1>
          <p className="subtitle" style={{ opacity: 0.8, marginBottom: '0.5rem' }}>{article.date}</p>
          <p className="subtitle">{article.description}</p>
          <div className="ctaRow">
            <Link className="button secondary" to="/blog">
              Back to Blog
            </Link>
            <Link className="button secondary" to="/">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="content">
        {article.content}
      </main>
    </div>
  )
}

export default BlogArticlePage
