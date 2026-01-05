import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import ProjectPage from './ProjectPage'
import { HomePage } from './components'

const App = (): JSX.Element => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
