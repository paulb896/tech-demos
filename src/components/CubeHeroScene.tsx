import React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'
import {
  ContactShadows,
  Edges,
  Environment,
  Float,
  Lightformer,
  RoundedBox,
  Text,
  useCursor
} from '@react-three/drei'
import { Bloom, EffectComposer, SSAO, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import type { SkillIconKind } from './SkillIcon'
import SkillMark3D from './SkillMark3D'

type Face = {
  position: [number, number, number]
  rotation: [number, number, number]
}

type DragRotateGroupProps = {
  children: React.ReactNode
}

const DragRotateGroup = ({ children }: DragRotateGroupProps): JSX.Element => {
  const dragGroupRef = React.useRef<THREE.Group>(null)
  const draggingRef = React.useRef(false)
  const activePointerIdRef = React.useRef<number | null>(null)
  const lastPointerRef = React.useRef<{ x: number; y: number } | null>(null)
  const movedSinceDownRef = React.useRef(false)
  const lastMoveTimeRef = React.useRef<number | null>(null)
  const angularVelocityRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  React.useEffect(() => {
    const releaseDrag = () => {
      draggingRef.current = false
      activePointerIdRef.current = null
      lastPointerRef.current = null
      movedSinceDownRef.current = false
      lastMoveTimeRef.current = null
    }

    window.addEventListener('pointerup', releaseDrag)
    window.addEventListener('pointercancel', releaseDrag)
    window.addEventListener('blur', releaseDrag)

    return () => {
      window.removeEventListener('pointerup', releaseDrag)
      window.removeEventListener('pointercancel', releaseDrag)
      window.removeEventListener('blur', releaseDrag)
    }
  }, [])

  useFrame((_state, delta) => {
    const group = dragGroupRef.current
    if (!group) return

    // Apply inertia when not actively dragging.
    if (!draggingRef.current) {
      const velocity = angularVelocityRef.current
      if (Math.abs(velocity.x) + Math.abs(velocity.y) < 1e-5) return

      group.rotation.x += velocity.x * delta
      group.rotation.y += velocity.y * delta
      group.rotation.x = THREE.MathUtils.clamp(group.rotation.x, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05)

      // Exponential damping: higher => quicker stop.
      // Tuned lower so it keeps spinning for a couple seconds.
      const damping = 3.8
      const decay = Math.exp(-damping * delta)
      velocity.x *= decay
      velocity.y *= decay
    }
  })

  return (
    <group
      onPointerDown={(event) => {
        // If an icon handles the event, it stops propagation and we won't start a drag.
        if (draggingRef.current) return

        event.stopPropagation()
        draggingRef.current = true
        activePointerIdRef.current = event.pointerId
        lastPointerRef.current = { x: event.clientX, y: event.clientY }
        movedSinceDownRef.current = false
        lastMoveTimeRef.current = performance.now()
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current) return
        if (activePointerIdRef.current !== event.pointerId) return
        if (!dragGroupRef.current) return

        const last = lastPointerRef.current
        if (!last) {
          lastPointerRef.current = { x: event.clientX, y: event.clientY }
          return
        }

        const dx = event.clientX - last.x
        const dy = event.clientY - last.y
        if (Math.abs(dx) + Math.abs(dy) > 0.5) movedSinceDownRef.current = true

        const rotateSpeed = 0.008
        const rotateX = dy * rotateSpeed
        const rotateY = dx * rotateSpeed

        dragGroupRef.current.rotation.y += rotateY
        dragGroupRef.current.rotation.x += rotateX
        dragGroupRef.current.rotation.x = THREE.MathUtils.clamp(
          dragGroupRef.current.rotation.x,
          -Math.PI / 2 + 0.05,
          Math.PI / 2 - 0.05
        )

        // Estimate angular velocity for inertia.
        const now = performance.now()
        const lastT = lastMoveTimeRef.current ?? now
        const dtSeconds = Math.max(0.001, (now - lastT) / 1000)
        const vx = rotateX / dtSeconds
        const vy = rotateY / dtSeconds
        const smooth = 0.35
        angularVelocityRef.current.x = THREE.MathUtils.lerp(angularVelocityRef.current.x, vx, smooth)
        angularVelocityRef.current.y = THREE.MathUtils.lerp(angularVelocityRef.current.y, vy, smooth)
        lastMoveTimeRef.current = now

        lastPointerRef.current = { x: event.clientX, y: event.clientY }
      }}
      onPointerUp={(event) => {
        if (activePointerIdRef.current !== event.pointerId) return
        draggingRef.current = false
        activePointerIdRef.current = null
        lastPointerRef.current = null
        movedSinceDownRef.current = false
        lastMoveTimeRef.current = null
      }}
      onPointerLeave={() => {
        draggingRef.current = false
        activePointerIdRef.current = null
        lastPointerRef.current = null
        movedSinceDownRef.current = false
        lastMoveTimeRef.current = null
      }}
    >
      <mesh position={[0, 0, 0]} castShadow={false} receiveShadow={false}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      <group ref={dragGroupRef}>{children}</group>
    </group>
  )
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
  isGlass: boolean
}

const CubeFaceSkillMarks = ({ selectedSkill, onSelectSkill, isGlass }: CubeFaceSkillMarksProps): JSX.Element => {
  const faceIcons: SkillIconKind[] = ['database', 'node', 'containers', 'kubernetes', 'graphql', 'code']
  const pressAmountRef = React.useRef<number[]>(faceIcons.map(() => 0))
  const pressTargetRef = React.useRef<number[]>(faceIcons.map(() => 0))
  const markGroupRefs = React.useRef<Array<THREE.Group | null>>(faceIcons.map(() => null))
  const faceGroupRefs = React.useRef<Array<THREE.Group | null>>(faceIcons.map(() => null))
  const facingRef = React.useRef<number[]>(faceIcons.map(() => 0))
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [bottomFaceIndex, setBottomFaceIndex] = React.useState<number>(0)

  const baseColor = '#eef2ff'
  const activeColor = '#a3e635'

  useCursor(hoveredIndex !== null, 'pointer', 'auto')

  const tempFaceWorldPosition = React.useMemo(() => new THREE.Vector3(), [])
  const tempFaceWorldQuaternion = React.useMemo(() => new THREE.Quaternion(), [])
  const tempFaceWorldNormal = React.useMemo(() => new THREE.Vector3(), [])
  const tempToCamera = React.useMemo(() => new THREE.Vector3(), [])
  const tempProjected = React.useMemo(() => new THREE.Vector3(), [])
  const tempLabelAnchorLocal = React.useMemo(() => new THREE.Vector3(0, -0.53, 0.07), [])
  const tempLabelAnchorWorld = React.useMemo(() => new THREE.Vector3(), [])

  React.useEffect(() => {
    const releaseAll = () => {
      pressTargetRef.current = pressTargetRef.current.map(() => 0)
    }

    window.addEventListener('pointerup', releaseAll)
    window.addEventListener('pointercancel', releaseAll)
    window.addEventListener('blur', releaseAll)

    return () => {
      window.removeEventListener('pointerup', releaseAll)
      window.removeEventListener('pointercancel', releaseAll)
      window.removeEventListener('blur', releaseAll)
    }
  }, [])

  useFrame((state: RootState, delta: number) => {
    for (let i = 0; i < faceIcons.length; i += 1) {
      const current = pressAmountRef.current[i] ?? 0
      const target = pressTargetRef.current[i] ?? 0
      const next = THREE.MathUtils.damp(current, target, 18, delta)
      pressAmountRef.current[i] = next

      const group = markGroupRefs.current[i]
      if (!group) continue

      const depth = next * 0.04
      const scale = 1 - next * 0.12
      group.position.z = depth
      group.scale.setScalar(scale)
    }

    for (let i = 0; i < faceIcons.length; i += 1) {
      const faceGroup = faceGroupRefs.current[i]
      if (!faceGroup) continue

      faceGroup.getWorldPosition(tempFaceWorldPosition)
      faceGroup.getWorldQuaternion(tempFaceWorldQuaternion)

      tempFaceWorldNormal.set(0, 0, 1).applyQuaternion(tempFaceWorldQuaternion).normalize()
      tempToCamera.copy(state.camera.position).sub(tempFaceWorldPosition).normalize()

      const facing = tempFaceWorldNormal.dot(tempToCamera)
      facingRef.current[i] = facing
    }

    let nextBottomIndex = bottomFaceIndex
    let bestScreenY = Number.NEGATIVE_INFINITY
    let fallbackMostFacingIndex = bottomFaceIndex
    let fallbackMostFacing = Number.NEGATIVE_INFINITY

    let currentScreenY = Number.NEGATIVE_INFINITY
    let currentValid = false

    const switchHysteresis = 0.03

    for (let i = 0; i < faceIcons.length; i += 1) {
      const faceGroup = faceGroupRefs.current[i]
      if (!faceGroup) continue

      const facing = facingRef.current[i] ?? 0
      if (facing > fallbackMostFacing) {
        fallbackMostFacing = facing
        fallbackMostFacingIndex = i
      }

      if (facing <= 0) continue

      const markGroup = markGroupRefs.current[i]
      tempLabelAnchorWorld.copy(tempLabelAnchorLocal)
      if (markGroup) {
        markGroup.localToWorld(tempLabelAnchorWorld)
      } else {
        faceGroup.localToWorld(tempLabelAnchorWorld)
      }
      tempProjected.copy(tempLabelAnchorWorld).project(state.camera)

      if (tempProjected.z < -1 || tempProjected.z > 1) continue
      if (Math.abs(tempProjected.x) > 1.15 || Math.abs(tempProjected.y) > 1.15) continue

      const screenY = (1 - tempProjected.y) * 0.5

      if (i === bottomFaceIndex) {
        currentScreenY = screenY
        currentValid = true
      }

      if (screenY > bestScreenY) {
        bestScreenY = screenY
        nextBottomIndex = i
      }
    }

    if (!currentValid) {
      if (bestScreenY === Number.NEGATIVE_INFINITY) nextBottomIndex = fallbackMostFacingIndex
    } else if (nextBottomIndex !== bottomFaceIndex) {
      if (bestScreenY < currentScreenY + switchHysteresis) nextBottomIndex = bottomFaceIndex
    }

    if (nextBottomIndex !== bottomFaceIndex) {
      setBottomFaceIndex(nextBottomIndex)
    }

    for (let i = 0; i < faceIcons.length; i += 1) {
      const markGroup = markGroupRefs.current[i]
      if (markGroup) {
        markGroup.visible = (facingRef.current[i] ?? 0) > 0.06
      }
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
        >
          <group
            ref={(node) => {
              markGroupRefs.current[index] = node
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
              pressTargetRef.current[index] = 1
              onSelectSkill(faceIcons[index])
            }}
          >
            <mesh position={[0, 0, 0.03]}>
              <planeGeometry args={[1.05, 1.05]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>

            <SkillMark3D
              kind={faceIcons[index]}
              active={selectedSkill === faceIcons[index]}
              overlay={isGlass && selectedSkill === faceIcons[index]}
              color={baseColor}
              activeColor={activeColor}
            />

            {index === bottomFaceIndex ? (
              <Text
                position={[0, -0.53, 0.07]}
                fontSize={0.105}
                color={selectedSkill === faceIcons[index] ? activeColor : baseColor}
                anchorX="center"
                anchorY="middle"
              >
                {skillLabelByKind[faceIcons[index]]}
              </Text>
            ) : null}
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
  const transmission = 0
  const isGlass = false

  // Rotation is controlled by user drag (PresentationControls).

  return (
    <RoundedBox ref={meshRef} args={[1.6, 1.6, 1.6]} radius={0.14} smoothness={8} castShadow receiveShadow>
      <meshPhysicalMaterial
        color="#4f46e5"
        roughness={0.045}
        metalness={0.26}
        transmission={transmission}
        thickness={0.5}
        ior={1.5}
        attenuationColor="#4f46e5"
        attenuationDistance={1.8}
        specularIntensity={1}
        envMapIntensity={1.9}
        clearcoat={1}
        clearcoatRoughness={0.05}
        emissive="#4f46e5"
        emissiveIntensity={0.07}
        transparent={false}
        opacity={1}
        depthWrite
      />
      <Edges linewidth={1} threshold={12} color="#e0e7ff" />
      <CubeFaceSkillMarks selectedSkill={selectedSkill} onSelectSkill={onSelectSkill} isGlass={isGlass} />
    </RoundedBox>
  )
}

export type HeroSceneProps = {
  selectedSkill: SkillIconKind | null
  onSelectSkill: (kind: SkillIconKind) => void
}

export const HeroScene = ({ selectedSkill, onSelectSkill }: HeroSceneProps): JSX.Element => {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 2]}
      shadows
      gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.12 }}
    >
      <color attach="background" args={["#f8fafc"]} />
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[3, 3, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={10}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-3, -2, -4]} intensity={0.55} color="#60a5fa" />
      <directionalLight position={[-6, 2, -2]} intensity={0.72} color="#a78bfa" />
      <pointLight position={[0.2, 1.2, 2.6]} intensity={0.45} color="#ffffff" />

      <Environment resolution={256}>
        <Lightformer
          intensity={2.6}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 6, -9]}
          scale={[12, 12, 1]}
        />
        <Lightformer
          intensity={1.45}
          rotation={[0, Math.PI / 2, 0]}
          position={[-6, 0.5, 0]}
          scale={[7.5, 3.2, 1]}
          color="#60a5fa"
        />
        <Lightformer
          intensity={1.25}
          rotation={[0, -Math.PI / 2, 0]}
          position={[6, -0.4, 0]}
          scale={[7.5, 3.2, 1]}
          color="#a78bfa"
        />
      </Environment>
      <DragRotateGroup>
        <Float speed={1.15} rotationIntensity={0} floatIntensity={0.65}>
          <RotatingCube selectedSkill={selectedSkill} onSelectSkill={onSelectSkill} />
        </Float>
      </DragRotateGroup>

      <ContactShadows position={[0, -1.06, 0]} opacity={0.18} blur={3.6} scale={7} far={4} />

      <EffectComposer multisampling={0} enableNormalPass>
        <SSAO
          samples={16}
          radius={0.16}
          intensity={10}
          luminanceInfluence={0.7}
          worldDistanceThreshold={1.3}
          worldDistanceFalloff={0.25}
          worldProximityThreshold={0.45}
          worldProximityFalloff={0.2}
        />
        <Bloom
          blendFunction={BlendFunction.SCREEN}
          intensity={0.35}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.25}
        />
        <Vignette eskil={false} offset={0.18} darkness={0.28} />
      </EffectComposer>
    </Canvas>
  )
}
