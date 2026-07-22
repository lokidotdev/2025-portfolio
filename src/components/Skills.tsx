"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { motion } from "motion/react";
import * as THREE from "three";
import { useGlobalContext } from "@/context/globalContext";
import ProximityText from "./ui/ProximityText";
import { themeColor, themeTokens } from "@/lib/theme";

// Each skill maps to a Simple Icons slug (https://simpleicons.org).
// cdn.simpleicons.org returns an <img>-friendly SVG, colored per icon.
interface Skill {
  name: string;
  slug: string;
}

// Every tech stack mentioned across the projects (see constants/projectData.ts).
const skills: Skill[] = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "TypeScript", slug: "typescript" },
  { name: "JavaScript", slug: "javascript" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "Express", slug: "express" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Prisma", slug: "prisma" },
  { name: "Redis", slug: "redis" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "GSAP", slug: "greensock" },
  { name: "Motion", slug: "framer" },
  { name: "Three.js", slug: "threedotjs" },
  { name: "Vite", slug: "vite" },
  { name: "Docker", slug: "docker" },
  { name: "Bootstrap", slug: "bootstrap" },
  { name: "HTML5", slug: "html5" },
  { name: "CSS", slug: "css" },
  { name: "ShadCN UI", slug: "shadcnui" },
  { name: "Coolify", slug: "coolify" },
  { name: "Razorpay", slug: "razorpay" },
  { name: "Resend", slug: "resend" },
  { name: "OpenAI", slug: "openai" },
];

const RADIUS = 3;

// Evenly distribute N points across a sphere (Fibonacci sphere).
function fibonacciSphere(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5)); // golden angle

  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * increment;
    points.push(
      new THREE.Vector3(
        Math.cos(phi) * r * radius,
        y * radius,
        Math.sin(phi) * r * radius,
      ),
    );
  }
  return points;
}

function SkillIcon({
  position,
  skill,
}: {
  position: THREE.Vector3;
  skill: Skill;
}) {
  return (
    <group position={position}>
      <Html
        center
        transform
        sprite
        distanceFactor={14}
      >
        <div className="pointer-events-none flex flex-col items-center gap-0.5 select-none">
          <img
            src={`https://cdn.simpleicons.org/${skill.slug}`}
            alt={skill.name}
            width={28}
            height={28}
            draggable={false}
            className="h-7 w-7"
          />
          <span className="text-[8px] font-light tracking-wide text-on-dark/70">
            {skill.name}
          </span>
        </div>
      </Html>
    </group>
  );
}

function SkillSphere({ darkTheme }: { darkTheme: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const points = useMemo(() => fibonacciSphere(skills.length, RADIUS), []);

  // Auto-rotate the whole sphere (wireframe + icons together).
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
      groupRef.current.rotation.x += delta * 0.04;
    }
  });

  const wireColor = themeColor(darkTheme ? "wire-dark" : "ink") || undefined;

  return (
    <group ref={groupRef}>
      {/* Wireframe sphere */}
      <mesh>
        <sphereGeometry args={[RADIUS, 24, 24]} />
        <meshBasicMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>

      {/* Skill icons scattered across the sphere */}
      {points.map((p, i) => (
        <SkillIcon key={skills[i].slug} position={p} skill={skills[i]} />
      ))}
    </group>
  );
}

export default function SkillsSection() {
  const { darkTheme } = useGlobalContext();
  const { text, subtle } = themeTokens(darkTheme);

  return (
    <section
      id="skills"
      className={`${
        darkTheme ? "dark-theme-bg" : "light-theme-bg"
      } ${text} w-full`}
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-16 md:py-32">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mb-3 text-sm md:mb-6 md:text-lg ${subtle}`}
          >
            // Tools I build with
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl font-thin italic leading-[100%] tracking-[-0.04em] md:text-[8vw]"
          >
            <ProximityText
              text="Skills"
              maxDistance={200}
              minWeight={100}
              maxWeight={700}
            />
          </motion.h2>
        </div>

        {/* 3D wireframe sphere */}
        <div className="h-[70vh] min-h-125 w-full">
          <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
            <Suspense fallback={null}>
              <SkillSphere darkTheme={darkTheme} />
            </Suspense>
            {/* Drag to rotate manually; auto-rotate continues via useFrame */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              rotateSpeed={0.5}
            />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
