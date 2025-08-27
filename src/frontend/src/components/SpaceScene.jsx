import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Rotating planet component
function RotatingPlanet({ position, color, radius = 1 }) {
  const mesh = useRef();
  useFrame(() => (mesh.current.rotation.y += 0.001));
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Sun with light
function Sun({ position }) {
  const mesh = useRef();
  useFrame(() => (mesh.current.rotation.y += 0.0005));
  return (
    <>
      <pointLight position={position} intensity={1.2} />
      <mesh ref={mesh} position={position}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#ffcc33" emissive="#ffaa00" emissiveIntensity={1} />
      </mesh>
    </>
  );
}

// Asteroid component
function Asteroid({ initialPosition, speed }) {
  const mesh = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    mesh.current.position.x = initialPosition[0] + Math.sin(t) * 3;
    mesh.current.position.y = initialPosition[1] + Math.cos(t * 1.5) * 2;
    mesh.current.position.z = initialPosition[2] + Math.sin(t * 1.1) * 1.5;
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={mesh} position={initialPosition}>
      <icosahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color="#888" />
    </mesh>
  );
}

// Spaceship component (simple cone and body)
function Spaceship({ initialPosition, speed }) {
  const mesh = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    mesh.current.position.x = initialPosition[0] + Math.sin(t) * 5;
    mesh.current.position.y = initialPosition[1] + Math.cos(t * 1.2) * 3;
    mesh.current.position.z = initialPosition[2] + Math.cos(t * 0.7) * 4;
    mesh.current.rotation.y += 0.02;
  });
  return (
    <mesh ref={mesh} position={initialPosition}>
      <coneGeometry args={[0.2, 0.8, 8]} />
      <meshStandardMaterial color="deepskyblue" />
    </mesh>
  );
}

// Main space scene
export default function SpaceScene() {
  // Generate random asteroids positions and speeds
  const asteroids = Array.from({ length: 30 }, () => ({
    initialPosition: [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 20,
    ],
    speed: Math.random() * 0.5 + 0.1,
  }));

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    >
      <ambientLight intensity={0.2} />
      <Sun position={[0, 0, 0]} />
      <RotatingPlanet position={[5, 0, -10]} color="royalblue" radius={1.5} />
      <RotatingPlanet position={[-5, 2, -15]} color="darkgreen" radius={1} />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={7}
        saturation={0}
        fade
        speed={1}
      />
      {asteroids.map(({ initialPosition, speed }, i) => (
        <Asteroid key={i} initialPosition={initialPosition} speed={speed} />
      ))}
      <Spaceship initialPosition={[0, 2, -5]} speed={0.7} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
