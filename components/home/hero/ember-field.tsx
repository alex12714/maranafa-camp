"use client"

import { useEffect, useMemo, useRef, type MutableRefObject } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

type Props = {
  progressRef: MutableRefObject<number>
  pointerRef: MutableRefObject<{ x: number; y: number }>
  active: boolean
  count: number
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  attribute float aSeed;
  attribute float aScale;
  varying float vAlpha;
  varying float vWarm;

  void main() {
    vec3 p = position;
    // Slow upward drift, wrapped inside a 10-unit tall column.
    float rise = uTime * (0.12 + aSeed * 0.18);
    p.y = mod(p.y + rise + 5.0, 10.0) - 5.0;
    // Lazy lateral wander.
    p.x += sin(uTime * 0.35 + aSeed * 40.0) * 0.25;
    p.z += cos(uTime * 0.28 + aSeed * 23.0) * 0.2;
    // Pointer parallax: nearer particles move more.
    float depth = (p.z + 4.0) / 6.0;
    p.xy += uPointer * depth * 0.35;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float twinkle = 0.55 + 0.45 * sin(uTime * (1.2 + aSeed * 2.4) + aSeed * 60.0);
    // Only a fraction of particles show in daylight; all of them by golden hour.
    float visible = smoothstep(aSeed - 0.15, aSeed + 0.05, 0.25 + uProgress * 0.9);
    // Fade out near the top and bottom of the column.
    float edge = smoothstep(-5.0, -3.5, p.y) * (1.0 - smoothstep(3.5, 5.0, p.y));
    vAlpha = twinkle * visible * edge * (0.35 + 0.65 * uProgress);
    vWarm = aSeed;

    gl_PointSize = aScale * uPixelRatio * (38.0 / -mv.z) * (0.8 + 0.4 * twinkle);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uProgress;
  varying float vAlpha;
  varying float vWarm;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 2.4);
    // Daylight dust is pale; golden hour turns it to amber embers.
    vec3 pale = vec3(1.0, 0.96, 0.86);
    vec3 gold = mix(vec3(0.98, 0.78, 0.36), vec3(0.95, 0.52, 0.24), vWarm);
    vec3 color = mix(pale, gold, smoothstep(0.1, 0.8, uProgress));
    float a = glow * vAlpha;
    if (a < 0.003) discard;
    gl_FragColor = vec4(color * (1.0 + glow * 0.6), a);
  }
`

function Embers({ progressRef, pointerRef, count }: Omit<Props, "active">) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const smoothPointer = useRef(new THREE.Vector2())
  const { camera, gl } = useThree()

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const scales = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = -4 + Math.random() * 6
      seeds[i] = Math.random()
      scales[i] = 0.6 + Math.pow(Math.random(), 3) * 2.2
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1))
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1))
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector2() },
    }),
    [],
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state, delta) => {
    const m = material.current
    if (!m) return
    const p = pointerRef.current
    const s = smoothPointer.current
    const k = Math.min(1, delta * 3)
    s.set(s.x + (p.x - s.x) * k, s.y + (p.y - s.y) * k)
    m.uniforms.uTime.value = state.clock.elapsedTime
    m.uniforms.uProgress.value += (progressRef.current - m.uniforms.uProgress.value) * Math.min(1, delta * 4)
    m.uniforms.uPixelRatio.value = gl.getPixelRatio()
    m.uniforms.uPointer.value.copy(smoothPointer.current)
    camera.position.x = smoothPointer.current.x * 0.25
    camera.position.y = smoothPointer.current.y * 0.15
    camera.lookAt(0, 0, -2)
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function EmberField({ progressRef, pointerRef, active, count }: Props) {
  return (
    <Canvas
      className="!absolute inset-0"
      style={{ pointerEvents: "none" }}
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 5], fov: 55 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
    >
      <Embers progressRef={progressRef} pointerRef={pointerRef} count={count} />
    </Canvas>
  )
}
