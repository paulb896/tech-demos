import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import ProjectPage from './pages/ProjectPage'
import { HomePage } from './pages/HomePage'
import AgentPromptsPage from './pages/AgentPromptsPage'

const App = (): JSX.Element => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/agent-prompts" element={<AgentPromptsPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
