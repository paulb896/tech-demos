import React from 'react'
import type { SkillIconKind } from './SkillIcon'
import * as THREE from 'three'

type SkillMark3DProps = {
  kind: SkillIconKind
  active?: boolean
  color?: string
  activeColor?: string
}

const IconMaterial = ({ color, active }: { color: string; active: boolean }): JSX.Element => {
  return (
    <meshBasicMaterial
      color={color}
      toneMapped={false}
      side={THREE.DoubleSide}
      transparent
      opacity={1}
      depthWrite={false}
    />
  )
}

const SkillMark3D = ({
  kind,
  active = false,
  color = '#eef2ff',
  activeColor = '#a3e635'
}: SkillMark3DProps): JSX.Element => {
  const rootRef = React.useRef<THREE.Group>(null)
  const materialColor = active ? activeColor : color
  const z = 0.02
  const thickness = 0.012
  const lineThickness = 0.01

  React.useEffect(() => {
    if (!rootRef.current) return
    const order = 10
    rootRef.current.traverse((obj) => {
      const mesh = obj as unknown as THREE.Mesh
      if (mesh && (mesh as unknown as { isMesh?: boolean }).isMesh) {
        mesh.renderOrder = order
      }
    })
  }, [active])

  const kubernetesRingShape = React.useMemo(() => {
    const outerR = 0.27
    const innerR = 0.234

    const shape = new THREE.Shape()
    shape.absarc(0, 0, outerR, 0, Math.PI * 2, false)

    const hole = new THREE.Path()
    hole.absarc(0, 0, innerR, 0, Math.PI * 2, true)
    shape.holes.push(hole)

    return shape
  }, [])

  const renderMaterial = () => <IconMaterial color={materialColor} active={active} />

  const Pill = ({ width, height, position }: { width: number; height: number; position: [number, number, number] }) => (
    <mesh position={position}>
      <boxGeometry args={[width, height, thickness]} />
      {renderMaterial()}
    </mesh>
  )

  const Dot = ({ position, radius = 0.05 }: { position: [number, number, number]; radius?: number }) => (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[radius, radius, thickness, 20]} />
      {renderMaterial()}
    </mesh>
  )

  const Disc = ({ position, radius, yScale = 0.62 }: { position: [number, number, number]; radius: number; yScale?: number }) => (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]} scale={[1, yScale, 1]}>
      <cylinderGeometry args={[radius, radius, thickness, 28]} />
      {renderMaterial()}
    </mesh>
  )

  if (kind === 'database') {
    return (
      <group ref={rootRef}>
        <Disc position={[0, 0.19, z]} radius={0.32} />
        <Pill width={0.64} height={0.28} position={[0, 0.02, z]} />
        <Disc position={[0, -0.15, z]} radius={0.32} />

        {/* subtle "side" hints */}
        <Pill width={0.06} height={0.34} position={[-0.29, 0.02, z + 0.003]} />
        <Pill width={0.06} height={0.34} position={[0.29, 0.02, z + 0.003]} />
      </group>
    )
  }

  if (kind === 'node') {
    return (
      <group ref={rootRef} position={[0, 0, z]}>
        {/* flat-ish hex badge */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, thickness, 6]} />
          {renderMaterial()}
        </mesh>
        {/* stylized "N" */}
        <mesh position={[-0.12, 0, 0.02]}>
          <boxGeometry args={[0.065, 0.42, lineThickness]} />
          {renderMaterial()}
        </mesh>
        <mesh position={[0.12, 0, 0.02]}>
          <boxGeometry args={[0.065, 0.42, lineThickness]} />
          {renderMaterial()}
        </mesh>
        <mesh rotation={[0, 0, -0.55]} position={[0, 0, 0.02]}>
          <boxGeometry args={[0.065, 0.5, lineThickness]} />
          {renderMaterial()}
        </mesh>
      </group>
    )
  }

  if (kind === 'containers') {
    return (
      <group ref={rootRef}>
        {/* flat container outline */}
        <Pill width={0.74} height={0.07} position={[0, 0.2, z]} />
        <Pill width={0.74} height={0.07} position={[0, -0.2, z]} />
        <Pill width={0.07} height={0.47} position={[-0.335, 0, z]} />
        <Pill width={0.07} height={0.47} position={[0.335, 0, z]} />

        {/* container ribs */}
        {[-0.17, 0, 0.17].map((x) => (
          <mesh key={x} position={[x, 0, z + 0.002]}>
            <boxGeometry args={[0.045, 0.42, lineThickness]} />
            {renderMaterial()}
          </mesh>
        ))}
      </group>
    )
  }

  if (kind === 'kubernetes') {
    return (
      <group ref={rootRef}>
        {/* flat "helm wheel" (Kubernetes-ish) */}
        <mesh position={[0, 0, z - thickness / 2]}>
          <extrudeGeometry args={[kubernetesRingShape, { depth: thickness, bevelEnabled: false }]} />
          {renderMaterial()}
        </mesh>

        <Dot position={[0, 0, z]} radius={0.06} />

        {Array.from({ length: 7 }).map((_, index) => {
          const angle = (index * Math.PI * 2) / 7
          const knobRadius = 0.032
          const knobDistance = 0.238
          const spokeLength = knobDistance
          const x = Math.cos(angle) * knobDistance
          const y = Math.sin(angle) * knobDistance

          return (
            <group key={`k8s-${index}`} rotation={[0, 0, angle]}>
              {/* outward-only spoke so it doesn't read as a long bar */}
              <mesh position={[0, spokeLength / 2, z]}>
                <boxGeometry args={[lineThickness, spokeLength, thickness]} />
                {renderMaterial()}
              </mesh>
              <Dot position={[x, y, z]} radius={knobRadius} />
            </group>
          )
        })}
      </group>
    )
  }

  if (kind === 'graphql') {
    return (
      <group ref={rootRef}>
        {/* flat hex outline + node graph (GraphQL-ish) */}
        {Array.from({ length: 6 }).map((_, index) => {
          const r = 0.32
          const angle = (index * Math.PI) / 3
          const mid = angle + Math.PI / 6
          const d = r * Math.cos(Math.PI / 6)
          const x = Math.cos(mid) * d
          const y = Math.sin(mid) * d

          return (
            <mesh key={`gql-edge-${index}`} position={[x, y, z]} rotation={[0, 0, angle]}>
              <boxGeometry args={[r, lineThickness, thickness]} />
              {renderMaterial()}
            </mesh>
          )
        })}

        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const r = 0.32
          const rad = (deg * Math.PI) / 180
          const x = Math.cos(rad) * r
          const y = Math.sin(rad) * r
          return <Dot key={`gql-node-${deg}`} position={[x, y, z + 0.002]} radius={0.05} />
        })}

        <Dot position={[0, 0, z + 0.002]} radius={0.055} />

        {/* connecting links */}
        <Pill width={0.64} height={lineThickness} position={[0, 0, z + 0.002]} />
        <mesh rotation={[0, 0, Math.PI / 3]} position={[0, 0, z + 0.002]}>
          <boxGeometry args={[0.64, lineThickness, thickness]} />
          {renderMaterial()}
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 3]} position={[0, 0, z + 0.002]}>
          <boxGeometry args={[0.64, lineThickness, thickness]} />
          {renderMaterial()}
        </mesh>
      </group>
    )
  }

  // code
  return (
    <group ref={rootRef}>
      {/* < */}
      <mesh rotation={[0, 0, Math.PI / 4]} position={[-0.2, 0.1, z]}>
        <boxGeometry args={[0.06, 0.32, thickness]} />
        {renderMaterial()}
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]} position={[-0.2, -0.1, z]}>
        <boxGeometry args={[0.06, 0.32, thickness]} />
        {renderMaterial()}
      </mesh>

      {/* / */}
      <mesh rotation={[0, 0, Math.PI / 7]} position={[0, 0, z]}>
        <boxGeometry args={[0.055, 0.6, thickness]} />
        {renderMaterial()}
      </mesh>

      {/* > */}
      <mesh rotation={[0, 0, -Math.PI / 4]} position={[0.2, 0.1, z]}>
        <boxGeometry args={[0.06, 0.32, thickness]} />
        {renderMaterial()}
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]} position={[0.2, -0.1, z]}>
        <boxGeometry args={[0.06, 0.32, thickness]} />
        {renderMaterial()}
      </mesh>
    </group>
  )
}

export default SkillMark3D
