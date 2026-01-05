import React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'
import { Edges, Environment, OrbitControls, RoundedBox, useCursor } from '@react-three/drei'
import { projects } from './projects'
import { HashRouter, Route, Routes } from 'react-router-dom'
import ProjectPage from './ProjectPage'
import LinkedInWidget from './LinkedInWidget'
import { linkedInProfile } from './profile'
import type { SkillIconKind } from './SkillIcon'
import SkillMark3D from './SkillMark3D'

type Face = {
  position: [number, number, number]
  rotation: [number, number, number]
}

const faceOffset = 0.805

const cubeFaces: Face[] = [
  { position: [0, 0, faceOffset], rotation: [0, 0, 0] }, // front
  { position: [0, 0, -faceOffset], rotation: [0, Math.PI, 0] }, // back
  { position: [faceOffset, 0, 0], rotation: [0, -Math.PI / 2, 0] }, // right
  { position: [-faceOffset, 0, 0], rotation: [0, Math.PI / 2, 0] }, // left
  { position: [0, faceOffset, 0], rotation: [-Math.PI / 2, 0, 0] }, // top
  { position: [0, -faceOffset, 0], rotation: [Math.PI / 2, 0, 0] } // bottom
]

const skillLabelByKind: Record<SkillIconKind, string> = {
  database: 'Databases',
  node: 'Node.js',
  containers: 'Containers',
  kubernetes: 'Kubernetes',
  graphql: 'GraphQL',
  code: 'Code'
}

type CubeFaceSkillMarksProps = {
  selectedSkill: SkillIconKind | null
  onSelectSkill: (kind: SkillIconKind) => void
}

const CubeFaceSkillMarks = ({ selectedSkill, onSelectSkill }: CubeFaceSkillMarksProps): JSX.Element => {
  const faceIcons: SkillIconKind[] = ['database', 'node', 'containers', 'kubernetes', 'graphql', 'code']
  const pressAmountRef = React.useRef<number[]>(faceIcons.map(() => 0))
  const markGroupRefs = React.useRef<Array<THREE.Group | null>>(faceIcons.map(() => null))
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  useCursor(hoveredIndex !== null, 'pointer', 'auto')

  useFrame((_state: RootState, delta: number) => {
    for (let i = 0; i < faceIcons.length; i += 1) {
      const current = pressAmountRef.current[i] ?? 0
      const next = THREE.MathUtils.damp(current, 0, 18, delta)
      pressAmountRef.current[i] = next

      const group = markGroupRefs.current[i]
      if (!group) continue

      const depth = next * 0.065
      const scale = 1 - next * 0.12
      group.position.z = -depth
      group.scale.setScalar(scale)
    }
  })

  return (
    <group>
      {cubeFaces.map((face, index) => (
        <group
          key={faceIcons[index]}
          position={face.position}
          rotation={face.rotation}
          onPointerOver={(event) => {
            event.stopPropagation()
            setHoveredIndex(index)
          }}
          onPointerOut={(event) => {
            event.stopPropagation()
            setHoveredIndex((current) => (current === index ? null : current))
          }}
          onPointerDown={(event) => {
            event.stopPropagation()
            pressAmountRef.current[index] = 1
            onSelectSkill(faceIcons[index])
          }}
        >
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.95, 0.95]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          {selectedSkill === faceIcons[index] ? (
            <mesh position={[0, 0, 0.006]} renderOrder={10}>
              <planeGeometry args={[1.52, 1.52]} />
              <meshBasicMaterial
                color="#a3e635"
                transparent
                opacity={0.22}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ) : null}

          <group
            ref={(node) => {
              markGroupRefs.current[index] = node
            }}
          >
            <SkillMark3D kind={faceIcons[index]} active={selectedSkill === faceIcons[index]} />
          </group>
        </group>
      ))}
    </group>
  )
}

type RotatingCubeProps = {
  selectedSkill: SkillIconKind | null
  onSelectSkill: (kind: SkillIconKind) => void
}

const RotatingCube = ({ selectedSkill, onSelectSkill }: RotatingCubeProps): JSX.Element => {
  const meshRef = React.useRef<THREE.Mesh>(null)

  useFrame((_state: RootState, delta: number) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.6
    meshRef.current.rotation.y += delta * 0.9
  })

  return (
    <RoundedBox ref={meshRef} args={[1.6, 1.6, 1.6]} radius={0.14} smoothness={8}>
      <meshPhysicalMaterial
        color="#4f46e5"
        roughness={0.22}
        metalness={0.55}
        clearcoat={0.85}
        clearcoatRoughness={0.25}
      />
      <Edges linewidth={1} threshold={12} color="#c7d2fe" />
      <CubeFaceSkillMarks selectedSkill={selectedSkill} onSelectSkill={onSelectSkill} />
    </RoundedBox>
  )
}

type HeroSceneProps = {
  selectedSkill: SkillIconKind | null
  onSelectSkill: (kind: SkillIconKind) => void
}

const HeroScene = ({ selectedSkill, onSelectSkill }: HeroSceneProps): JSX.Element => {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={["#f8fafc"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 3, 4]} intensity={1.1} />
      <directionalLight position={[-3, -2, -4]} intensity={0.6} color="#60a5fa" />
      <Environment preset="city" />
      <RotatingCube selectedSkill={selectedSkill} onSelectSkill={onSelectSkill} />
      <OrbitControls enablePan={false} enableZoom={false} enableDamping />
    </Canvas>
  )
}

const HomePage = (): JSX.Element => {
  const [selectedSkill, setSelectedSkill] = React.useState<SkillIconKind | null>(null)

  const selectedSkillLabel = selectedSkill ? skillLabelByKind[selectedSkill] : null

  return (
    <div className="page">
      <header className="hero">
        <div className="heroText">
          <h1 className="title">Backend developer</h1>
          <p className="subtitle">
            Nearly 20 years of professional experience building reliable web systems.
          </p>
          <div className="ctaRow">
            <a className="button secondary" href="https://github.com/paulb896" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>

          <LinkedInWidget {...linkedInProfile} variant="hero" />
        </div>

        <div>
          <div className="hero3d" aria-label="3D rotating cube demo">
            <HeroScene selectedSkill={selectedSkill} onSelectSkill={setSelectedSkill} />
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
            I focus on backend architecture, performance, reliability, and developer experience.
            I like clear interfaces, pragmatic monitoring, and systems that fail gracefully.
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
          <p>
            Add your email, LinkedIn, and any preferred contact links here.
          </p>
        </section>
      </main>
    </div>
  )
}

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
