"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, PresentationControls, Float, MeshTransmissionMaterial } from "@react-three/drei"
import type { MotionValue } from "framer-motion"
import * as THREE from "three"

// Custom bottle component without framer-motion-3d
function PerfumeBottle({
  position,
  rotation,
  color,
  scrollYProgress,
  index,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  scrollYProgress: MotionValue<number>
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Use useFrame to handle animations instead of motion components
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return

    // Add subtle floating animation
    meshRef.current.rotation.y += 0.001
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.002

    // Handle scroll-based positioning
    const scrollValue = scrollYProgress.get()
    const targetY = position[1] - scrollValue * index * 4
    const targetRotY = rotation[1] + scrollValue * Math.PI * 2

    // Smooth interpolation
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05)

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05)
  })

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
    >
      {/* Bottle base */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.5}
          roughness={0.05}
          transmission={0.95}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.5}
          distortionScale={0.3}
          temporalDistortion={0.3}
          color={color}
        />
      </mesh>

      {/* Bottle neck */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.5, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.5}
          roughness={0.05}
          transmission={0.95}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.5}
          distortionScale={0.3}
          temporalDistortion={0.3}
          color={color}
        />
      </mesh>

      {/* Bottle cap */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.3, 32]} />
        <meshStandardMaterial color="gold" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default function PerfumeScene({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="w-full h-full absolute inset-0 z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <PresentationControls
          global
          snap
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 6, Math.PI / 6]}
          config={{ mass: 2, tension: 400 }}
          cursor={false}
        >
          <Float floatIntensity={0.5} rotationIntensity={0.2} speed={2}>
            <PerfumeBottle
              position={[-2, 0, 0]}
              rotation={[0, Math.PI / 6, 0]}
              color="#d4a76a"
              scrollYProgress={scrollYProgress}
              index={0}
            />
            <PerfumeBottle
              position={[0, 0, 0]}
              rotation={[0, -Math.PI / 6, 0]}
              color="#9370db"
              scrollYProgress={scrollYProgress}
              index={1}
            />
            <PerfumeBottle
              position={[2, 0, 0]}
              rotation={[0, Math.PI / 8, 0]}
              color="#e6b3b3"
              scrollYProgress={scrollYProgress}
              index={2}
            />
          </Float>
        </PresentationControls>

        <Environment preset="studio" background={false} />
      </Canvas>
    </div>
  )
}

