import React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'
import { Edges, Environment, Html, OrbitControls, RoundedBox, Text, useCursor } from '@react-three/drei'
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
  { position: [faceOffset, 0, 0], rotation: [0, Math.PI / 2, 0] }, // right
  { position: [-faceOffset, 0, 0], rotation: [0, -Math.PI / 2, 0] }, // left
  { position: [0, faceOffset, 0], rotation: [-Math.PI / 2, 0, 0] }, // top
  { position: [0, -faceOffset, 0], rotation: [Math.PI / 2, 0, 0] } // bottom
]

export const skillLabelByKind: Record<SkillIconKind, string> = {
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
  const faceGroupRefs = React.useRef<Array<THREE.Group | null>>(faceIcons.map(() => null))
  const labelRefs = React.useRef<Array<THREE.Mesh | null>>(faceIcons.map(() => null))
  const labelOpacityRef = React.useRef<number[]>(faceIcons.map(() => 0))
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  const baseColor = '#eef2ff'
  const activeColor = '#a3e635'

  useCursor(hoveredIndex !== null, 'pointer', 'auto')

  const tempFaceWorldPosition = React.useMemo(() => new THREE.Vector3(), [])
  const tempFaceWorldQuaternion = React.useMemo(() => new THREE.Quaternion(), [])
  const tempFaceWorldNormal = React.useMemo(() => new THREE.Vector3(), [])
  const tempToCamera = React.useMemo(() => new THREE.Vector3(), [])

  const setMeshOpacity = React.useCallback((mesh: THREE.Mesh, opacity: number) => {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const material of materials) {
      ;(material as unknown as { transparent?: boolean }).transparent = true
      ;(material as unknown as { opacity?: number }).opacity = opacity
      ;(material as unknown as { depthWrite?: boolean }).depthWrite = false
    }

    mesh.visible = opacity > 0.02
  }, [])

  useFrame((state: RootState, delta: number) => {
    for (let i = 0; i < faceIcons.length; i += 1) {
      const current = pressAmountRef.current[i] ?? 0
      const next = THREE.MathUtils.damp(current, 0, 18, delta)
      pressAmountRef.current[i] = next

      const group = markGroupRefs.current[i]
      if (!group) continue

      // Move outward (away from the cube) to avoid intersecting the glass,
      // which can create shadow/refraction artifacts.
      const depth = next * 0.04
      const scale = 1 - next * 0.12
      group.position.z = depth
      group.scale.setScalar(scale)
    }

    let bestIndex = -1
    let bestDot = -1

    for (let i = 0; i < faceIcons.length; i += 1) {
      const faceGroup = faceGroupRefs.current[i]
      if (!faceGroup) continue

      faceGroup.getWorldPosition(tempFaceWorldPosition)
      faceGroup.getWorldQuaternion(tempFaceWorldQuaternion)

      tempFaceWorldNormal.set(0, 0, 1).applyQuaternion(tempFaceWorldQuaternion).normalize()
      tempToCamera.copy(state.camera.position).sub(tempFaceWorldPosition).normalize()

      const facing = tempFaceWorldNormal.dot(tempToCamera)
      if (facing > bestDot) {
        bestDot = facing
        bestIndex = i
      }
    }

    const threshold = 0.75

    const activeFaceIndex = bestDot >= threshold ? bestIndex : -1
    for (let i = 0; i < faceIcons.length; i += 1) {
      const currentOpacity = labelOpacityRef.current[i] ?? 0
      const targetOpacity = i === activeFaceIndex ? 1 : 0
      const nextOpacity = THREE.MathUtils.damp(currentOpacity, targetOpacity, 10, delta)
      labelOpacityRef.current[i] = nextOpacity

      const labelMesh = labelRefs.current[i]
      if (!labelMesh) continue
      setMeshOpacity(labelMesh, nextOpacity)
    }
  })

  return (
    <group>
      {cubeFaces.map((face, index) => (
        <group
          key={faceIcons[index]}
          position={face.position}
          rotation={face.rotation}
          ref={(node) => {
            faceGroupRefs.current[index] = node
          }}
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
            <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>

          <group
            ref={(node) => {
              markGroupRefs.current[index] = node
            }}
          >
            <SkillMark3D
              kind={faceIcons[index]}
              active={selectedSkill === faceIcons[index]}
              color={baseColor}
              activeColor={activeColor}
            />

            <Text
              ref={(node) => {
                labelRefs.current[index] = node
              }}
              position={[0, -0.53, 0.07]}
              fontSize={0.105}
              color={selectedSkill === faceIcons[index] ? activeColor : baseColor}
              anchorX="center"
              anchorY="middle"
            >
              {skillLabelByKind[faceIcons[index]]}
            </Text>
          </group>
        </group>
      ))}
    </group>
  )
}

type RotatingCubeProps = {
  selectedSkill: SkillIconKind | null
  onSelectSkill: (kind: SkillIconKind) => void
  transmission: number
}

const RotatingCube = ({ selectedSkill, onSelectSkill, transmission }: RotatingCubeProps): JSX.Element => {
  const meshRef = React.useRef<THREE.Mesh>(null)

  useFrame((_state: RootState, delta: number) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.6
    meshRef.current.rotation.y += delta * 0.9
  })

  return (
    <RoundedBox ref={meshRef} args={[1.6, 1.6, 1.6]} radius={0.14} smoothness={8} renderOrder={0}>
      <meshPhysicalMaterial
        color="#4f46e5"
        roughness={0.06}
        metalness={0}
        transmission={transmission}
        thickness={0.5}
        ior={1.5}
        attenuationColor="#4f46e5"
        attenuationDistance={1.8}
        specularIntensity={1}
        envMapIntensity={1.25}
        clearcoat={1}
        clearcoatRoughness={0.08}
        transparent
        depthWrite={false}
      />
      <Edges linewidth={1} threshold={12} color="#c7d2fe" />
      <CubeFaceSkillMarks selectedSkill={selectedSkill} onSelectSkill={onSelectSkill} />
    </RoundedBox>
  )
}

export type HeroSceneProps = {
  selectedSkill: SkillIconKind | null
  onSelectSkill: (kind: SkillIconKind) => void
  transmission: number
  onChangeTransmission: (value: number) => void
}

export const HeroScene = ({
  selectedSkill,
  onSelectSkill,
  transmission,
  onChangeTransmission
}: HeroSceneProps): JSX.Element => {
  const [isHudInteracting, setIsHudInteracting] = React.useState(false)

  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={["#f8fafc"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 3, 4]} intensity={1.1} />
      <directionalLight position={[-3, -2, -4]} intensity={0.6} color="#60a5fa" />
      <Environment preset="city" />
      <RotatingCube selectedSkill={selectedSkill} onSelectSkill={onSelectSkill} transmission={transmission} />

      <Html fullscreen>
        <div className="canvasHud" style={{ pointerEvents: 'auto' }}>
          <label className="canvasHudLabel">
            Glass
            <input
              className="canvasHudSlider"
              type="range"
              min={0.05}
              max={1}
              step={0.01}
              value={transmission}
              onChange={(e) => onChangeTransmission(Number(e.target.value))}
              onPointerDown={(e) => {
                e.stopPropagation()
                setIsHudInteracting(true)
              }}
              onPointerUp={(e) => {
                e.stopPropagation()
                setIsHudInteracting(false)
              }}
              onPointerCancel={(e) => {
                e.stopPropagation()
                setIsHudInteracting(false)
              }}
              onPointerLeave={(e) => {
                e.stopPropagation()
                setIsHudInteracting(false)
              }}
              aria-label="Cube transparency"
            />
          </label>
        </div>
      </Html>

      <OrbitControls enabled={!isHudInteracting} enablePan={false} enableZoom={false} enableDamping />
    </Canvas>
  )
}
