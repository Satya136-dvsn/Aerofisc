/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Text } from '@react-three/drei';

// Simplified Globe to ensure rendering
const GlowingGlobe = () => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
        }
    });

    return (
        <group>
            {/* Core Globe */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[2.2, 64, 64]} />
                <meshStandardMaterial
                    color="#1e1b4b"
                    emissive="#3b82f6"
                    emissiveIntensity={0.2}
                    roughness={0.7}
                    metalness={0.8}
                    wireframe={true}
                />
            </mesh>
            {/* Inner Glow Sphere */}
            <mesh>
                <sphereGeometry args={[2.18, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>
        </group>
    );
};

const Scene3D = () => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#3b82f6" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                    <GlowingGlobe />
                </Float>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.5}
                />
            </Canvas>
        </div>
    );
};

export default Scene3D;
