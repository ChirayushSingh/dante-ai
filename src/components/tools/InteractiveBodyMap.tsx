import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Html } from "@react-three/drei";
import * as THREE from "three";

// Types for body parts
type BodyPart = "Head" | "Chest" | "Stomach" | "Left Arm" | "Right Arm" | "Left Leg" | "Right Leg";

interface BodyPartProps {
    position: [number, number, number];
    args: any; // Geometry arguments
    color: string;
    label: BodyPart;
    onClick: (part: BodyPart) => void;
    hoveredPart: BodyPart | null;
    setHoveredPart: (part: BodyPart | null) => void;
}

const BodyMesh = ({ position, args, color, label, onClick, hoveredPart, setHoveredPart }: BodyPartProps) => {
    const mesh = useRef<THREE.Mesh>(null);
    const isHovered = hoveredPart === label;

    useFrame((state) => {
        if (mesh.current && isHovered) {
            mesh.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
        } else if (mesh.current) {
            mesh.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
    });

    return (
        <group position={new THREE.Vector3(...position)}>
            <mesh
                ref={mesh}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(label);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                    setHoveredPart(label);
                }}
                onPointerOut={(e) => {
                    document.body.style.cursor = 'auto';
                    setHoveredPart(null);
                }}
            >
                {/* We use box geometry for simplicity as "Minecraft-style" or abstract can be stylish */}
                {/* But user asked for geometric. Let's make it look slightly robotic/clean. */}
                <boxGeometry args={args} />
                <meshStandardMaterial
                    color={isHovered ? "#0ea5e9" : color}
                    roughness={0.3}
                    metalness={0.8}
                    emissive={isHovered ? "#0ea5e9" : "#000000"}
                    emissiveIntensity={isHovered ? 0.5 : 0}
                />
            </mesh>
            {isHovered && (
                <Html position={[0, args[1] / 2 + 0.2, 0]} center>
                    <div className="bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-md border border-white/20 whitespace-nowrap">
                        {label}
                    </div>
                </Html>
            )}
        </group>
    );
};

interface InteractiveBodyMapProps {
    onPartSelect: (part: string) => void;
}

export function InteractiveBodyMap({ onPartSelect }: InteractiveBodyMapProps) {
    const [hoveredPart, setHoveredPart] = useState<BodyPart | null>(null);

    const handleSelect = (part: BodyPart) => {
        console.log("Selected:", part);
        onPartSelect(part);
    };

    return (
        <div className="w-full h-[500px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-white font-display font-bold text-xl">3D Body Scanner</h3>
                <p className="text-slate-400 text-sm">Click on the affected area</p>
            </div>

            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={1} color="#0ea5e9" />

                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <group position={[0, -1, 0]}>
                        {/* Head */}
                        <BodyMesh
                            position={[0, 3.2, 0]}
                            args={[0.8, 0.9, 0.8]} // Box args: width, height, depth
                            color="#e2e8f0"
                            label="Head"
                            onClick={handleSelect}
                            hoveredPart={hoveredPart}
                            setHoveredPart={setHoveredPart}
                        />
                        {/* Neck (visual only) */}
                        <mesh position={[0, 2.6, 0]}>
                            <cylinderGeometry args={[0.2, 0.2, 0.4]} />
                            <meshStandardMaterial color="#cbd5e1" />
                        </mesh>

                        {/* Torso/Chest */}
                        <BodyMesh
                            position={[0, 1.5, 0]}
                            args={[1.6, 1.8, 0.8]}
                            color="#cbd5e1"
                            label="Chest"
                            onClick={handleSelect}
                            hoveredPart={hoveredPart}
                            setHoveredPart={setHoveredPart}
                        />

                        {/* Stomach/Abdomen */}
                        <BodyMesh
                            position={[0, -0.2, 0]}
                            args={[1.4, 1.6, 0.8]}
                            color="#94a3b8"
                            label="Stomach"
                            onClick={handleSelect}
                            hoveredPart={hoveredPart}
                            setHoveredPart={setHoveredPart}
                        />

                        {/* Arms */}
                        <BodyMesh
                            position={[-1.2, 1.5, 0]}
                            args={[0.5, 2.2, 0.5]}
                            color="#e2e8f0"
                            label="Left Arm"
                            onClick={handleSelect}
                            hoveredPart={hoveredPart}
                            setHoveredPart={setHoveredPart}
                        />
                        <BodyMesh
                            position={[1.2, 1.5, 0]}
                            args={[0.5, 2.2, 0.5]}
                            color="#e2e8f0"
                            label="Right Arm"
                            onClick={handleSelect}
                            hoveredPart={hoveredPart}
                            setHoveredPart={setHoveredPart}
                        />

                        {/* Legs */}
                        <BodyMesh
                            position={[-0.5, -2.5, 0]}
                            args={[0.6, 3, 0.6]}
                            color="#cbd5e1"
                            label="Left Leg"
                            onClick={handleSelect}
                            hoveredPart={hoveredPart}
                            setHoveredPart={setHoveredPart}
                        />
                        <BodyMesh
                            position={[0.5, -2.5, 0]}
                            args={[0.6, 3, 0.6]}
                            color="#cbd5e1"
                            label="Right Leg"
                            onClick={handleSelect}
                            hoveredPart={hoveredPart}
                            setHoveredPart={setHoveredPart}
                        />
                    </group>
                </Float>

                {/* Floor reflection effect */}
                <gridHelper args={[20, 20, 0x444444, 0x222222]} position={[0, -4, 0]} />
            </Canvas>
        </div>
    );
}
