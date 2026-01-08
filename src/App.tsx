import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProjectPage from './pages/ProjectPage'
import { HomePage } from './pages/HomePage'
import AgentPromptsPage from './pages/AgentPromptsPage'
import BlogArticlePage from './pages/BlogArticlePage'
import BlogIndexPage from './pages/BlogIndexPage'
import { ScrollRestoration } from './components/ScrollRestoration'

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <ScrollRestoration />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/agent-prompts" element={<AgentPromptsPage />} />
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogArticlePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
