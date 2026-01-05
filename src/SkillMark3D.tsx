import React from 'react'
import type { SkillIconKind } from './SkillIcon'

type SkillMark3DProps = {
  kind: SkillIconKind
  active?: boolean
  color?: string
  activeColor?: string
}

const IconMaterial = ({ color, active }: { color: string; active: boolean }): JSX.Element => {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.35}
      metalness={0.05}
      emissive={active ? color : '#000000'}
      emissiveIntensity={active ? 0.9 : 0}
    />
  )
}

const SkillMark3D = ({
  kind,
  active = false,
  color = '#eef2ff',
  activeColor = '#a3e635'
}: SkillMark3DProps): JSX.Element => {
  const materialColor = active ? activeColor : color
  const z = 0.012
  const thickness = 0.04

  if (kind === 'database') {
    return (
      <group>
        {[0.2, 0, -0.2].map((y) => (
          <mesh key={y} rotation={[Math.PI / 2, 0, 0]} position={[0, y, z]}>
            <cylinderGeometry args={[0.24, 0.24, thickness, 24]} />
            <IconMaterial color={materialColor} active={active} />
          </mesh>
        ))}
      </group>
    )
  }

  if (kind === 'node') {
    return (
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z]}>
        <cylinderGeometry args={[0.28, 0.28, thickness, 6]} />
        <IconMaterial color={materialColor} active={active} />
      </mesh>
    )
  }

  if (kind === 'containers') {
    return (
      <group>
        <mesh position={[-0.14, 0.08, z]}>
          <boxGeometry args={[0.22, 0.22, thickness]} />
          <IconMaterial color={materialColor} active={active} />
        </mesh>
        <mesh position={[0.14, 0.08, z]}>
          <boxGeometry args={[0.22, 0.22, thickness]} />
          <IconMaterial color={materialColor} active={active} />
        </mesh>
        <mesh position={[0, -0.16, z]}>
          <boxGeometry args={[0.5, 0.22, thickness]} />
          <IconMaterial color={materialColor} active={active} />
        </mesh>
      </group>
    )
  }

  if (kind === 'kubernetes') {
    return (
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z]}>
          <torusGeometry args={[0.26, 0.06, 10, 28]} />
          <IconMaterial color={materialColor} active={active} />
        </mesh>
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <mesh key={deg} rotation={[0, 0, (deg * Math.PI) / 180]} position={[0, 0, z]}>
            <boxGeometry args={[0.06, 0.42, thickness]} />
            <IconMaterial color={materialColor} active={active} />
          </mesh>
        ))}
      </group>
    )
  }

  if (kind === 'graphql') {
    return (
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z]}>
          <cylinderGeometry args={[0.3, 0.3, thickness, 6]} />
          <IconMaterial color={materialColor} active={active} />
        </mesh>
        <mesh position={[0, 0, z]}>
          <boxGeometry args={[0.56, 0.06, thickness]} />
          <IconMaterial color={materialColor} active={active} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 3]} position={[0, 0, z]}>
          <boxGeometry args={[0.56, 0.06, thickness]} />
          <IconMaterial color={materialColor} active={active} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 3]} position={[0, 0, z]}>
          <boxGeometry args={[0.56, 0.06, thickness]} />
          <IconMaterial color={materialColor} active={active} />
        </mesh>
      </group>
    )
  }

  // code
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 6]} position={[-0.18, 0, z]}>
        <boxGeometry args={[0.08, 0.52, thickness]} />
        <IconMaterial color={materialColor} active={active} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 6]} position={[0.18, 0, z]}>
        <boxGeometry args={[0.08, 0.52, thickness]} />
        <IconMaterial color={materialColor} active={active} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, z]}>
        <boxGeometry args={[0.08, 0.5, thickness]} />
        <IconMaterial color={materialColor} active={active} />
      </mesh>
    </group>
  )
}

export default SkillMark3D
