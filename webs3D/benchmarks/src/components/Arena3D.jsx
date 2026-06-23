import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, OrbitControls, Environment, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { AI_MODELS } from '../data/models'

function Platform() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[6, 6.5, 0.15, 64]} />
        <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <ringGeometry args={[5.8, 6.5, 64]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
        <ringGeometry args={[2.8, 3.0, 64]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[7, 8, 0.8, 64]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function ModelGeometry({ model, isActive, isSelected }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const time = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    time.current += delta

    const baseY = 1.2
    meshRef.current.position.y = baseY + Math.sin(time.current * 0.8) * 0.2

    if (isActive === 'activating') {
      meshRef.current.rotation.y += delta * 4
      meshRef.current.scale.setScalar(1 + Math.sin(time.current * 8) * 0.08)
    } else {
      meshRef.current.rotation.y += delta * 0.5
      meshRef.current.scale.setScalar(isSelected ? 1.2 : 1)
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = isActive === 'activating'
        ? 0.4 + Math.sin(time.current * 6) * 0.2
        : isSelected ? 0.25 : 0.1
    }
  })

  const geometry = useMemo(() => {
    switch (model.geometry) {
      case 'icosahedron': return <icosahedronGeometry args={[0.7, 0]} />
      case 'sphere': return <sphereGeometry args={[0.65, 32, 32]} />
      case 'box': return <boxGeometry args={[1, 1, 1]} />
      case 'octahedron': return <octahedronGeometry args={[0.75, 0]} />
      default: return <sphereGeometry args={[0.65, 32, 32]} />
    }
  }, [model.geometry])

  const emissiveIntensity = isActive === 'activating' ? 1.5 : isSelected ? 0.8 : 0.3
  const [px, , pz] = model.position

  return (
    <group position={[px, 0, pz]}>
      <mesh ref={meshRef} castShadow>
        {geometry}
        <meshStandardMaterial
          color={model.color}
          metalness={0.6}
          roughness={0.2}
          emissive={model.color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh ref={glowRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshBasicMaterial color={model.color} transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.3}
        color={model.color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.woff"
      >
        {model.name}
      </Text>
      <Text
        position={[0, -0.65, 0]}
        fontSize={0.18}
        color="#6B7280"
        anchorX="center"
        anchorY="middle"
      >
        {model.provider}
      </Text>
    </group>
  )
}

function FlyingOrbs({ active, models }) {
  const orbsRef = useRef([])
  const progress = useRef(0)

  useFrame((state, delta) => {
    if (!active) { progress.current = 0; return }
    progress.current = Math.min(progress.current + delta * 1.5, 1)

    orbsRef.current.forEach((orb, i) => {
      if (!orb) return
      const target = new THREE.Vector3(...models[i].position)
      const t = THREE.MathUtils.easeInCubic(progress.current)
      orb.position.lerpVectors(new THREE.Vector3(0, 1.5, 0), target, t)
      orb.position.y += Math.sin(t * Math.PI) * 1.5
      orb.material.opacity = active ? 1 - progress.current * 0.5 : 0
    })
  })

  return (
    <>
      {models.map((model, i) => (
        <mesh key={model.id} ref={el => orbsRef.current[i] = el} position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={model.color} transparent opacity={active ? 1 : 0} />
        </mesh>
      ))}
    </>
  )
}

function MetricBars({ results }) {
  if (!results.length) return null

  const maxQuality = Math.max(...results.map(r => r.quality))

  return (
    <group position={[0, 0.1, 0]}>
      {results.map((result, i) => {
        const model = AI_MODELS.find(m => m.id === result.modelId)
        if (!model) return null
        const [px, , pz] = model.position
        const nx = px * 0.35
        const nz = pz * 0.35
        const height = (result.quality / 100) * 3
        const isWinner = result.quality === maxQuality

        return (
          <group key={result.modelId} position={[nx, 0, nz]}>
            <AnimatedBar height={height} color={model.color} isWinner={isWinner} />
            <Text
              position={[0, height + 0.4, 0]}
              fontSize={0.22}
              color={model.color}
              anchorX="center"
              anchorY="middle"
            >
              {result.quality.toFixed(0)}
            </Text>
            <Text
              position={[0, height + 0.15, 0]}
              fontSize={0.14}
              color="#9CA3AF"
              anchorX="center"
              anchorY="middle"
            >
              {(result.responseTime / 1000).toFixed(1)}s
            </Text>
            {isWinner && <CrownParticles color={model.color} height={height} />}
          </group>
        )
      })}
    </group>
  )
}

function AnimatedBar({ height, color, isWinner }) {
  const meshRef = useRef()
  const currentHeight = useRef(0)
  const targetHeight = height

  useFrame((state, delta) => {
    if (!meshRef.current) return
    currentHeight.current = THREE.MathUtils.lerp(currentHeight.current, targetHeight, delta * 3)
    meshRef.current.scale.y = currentHeight.current
    meshRef.current.position.y = currentHeight.current / 2
  })

  return (
    <mesh ref={meshRef} castShadow>
      <cylinderGeometry args={[0.18, 0.22, 1, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isWinner ? 0.6 : 0.2}
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  )
}

function CrownParticles({ color, height }) {
  const groupRef = useRef()
  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    }))
  , [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i]
      const t = state.clock.elapsedTime * p.speed + p.offset
      child.position.x = Math.cos(p.angle + t * 0.5) * 0.4
      child.position.z = Math.sin(p.angle + t * 0.5) * 0.4
      child.position.y = height + 0.8 + Math.sin(t * 2) * 0.3
      child.material.opacity = 0.4 + Math.sin(t) * 0.3
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function CameraController({ selectedModel }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 8, 14))
  const targetLook = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    if (selectedModel) {
      const model = AI_MODELS.find(m => m.id === selectedModel)
      if (model) {
        const [px, , pz] = model.position
        targetPos.current.set(px * 1.8, 4, pz * 1.8)
        targetLook.current.set(px * 0.5, 1, pz * 0.5)
      }
    } else {
      targetPos.current.set(0, 8, 14)
      targetLook.current.set(0, 0, 0)
    }
  }, [selectedModel])

  useFrame((state, delta) => {
    camera.position.lerp(targetPos.current, delta * 2)
    const look = new THREE.Vector3()
    look.lerp(targetLook.current, delta * 2)
  })

  return null
}

export default function Arena3D({ phase, activeModels, results, orbsFlying, selectedModel, onSelectModel }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 8, 14], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#020817']} />
      <fog attach="fog" args={['#020817', 20, 45]} />

      <ambientLight intensity={0.15} />
      <directionalLight position={[0, 10, 0]} intensity={1} castShadow color="#ffffff" />
      <pointLight position={[0, 3, 0]} intensity={2} color="#F59E0B" distance={12} />
      <pointLight position={[-6, 2, 0]} intensity={0.8} color="#3B82F6" distance={10} />
      <pointLight position={[6, 2, 0]} intensity={0.8} color="#8B5CF6" distance={10} />

      <Stars radius={80} depth={50} count={3000} factor={3} fade speed={0.5} />

      <Platform />

      {AI_MODELS.map(model => (
        <group key={model.id} onClick={() => onSelectModel(model.id === selectedModel ? null : model.id)}>
          <ModelGeometry
            model={model}
            isActive={activeModels[model.id]}
            isSelected={selectedModel === model.id}
          />
        </group>
      ))}

      <FlyingOrbs active={orbsFlying} models={AI_MODELS} />

      {results.length > 0 && <MetricBars results={results} />}

      <CameraController selectedModel={selectedModel} />
      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2.2}
        enabled={!selectedModel}
      />
    </Canvas>
  )
}
