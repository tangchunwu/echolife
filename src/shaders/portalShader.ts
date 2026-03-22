export const portalVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vUv = uv;
    vPosition = position;
    vec3 pos = position;
    pos.z += sin(pos.x * 3.0 + uTime * 2.0) * 0.05;
    pos.z += cos(pos.y * 3.0 + uTime * 1.5) * 0.05;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const portalFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying vec2 vUv;

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    float angle = atan(center.y, center.x);

    float spiral = sin(angle * 5.0 - uTime * 3.0 + dist * 10.0) * 0.5 + 0.5;
    float glow = smoothstep(0.5, 0.0, dist);
    float ring = smoothstep(0.02, 0.0, abs(dist - 0.3 + sin(uTime) * 0.05));

    vec3 color = mix(uColor1, uColor2, spiral);
    color += ring * vec3(1.0);

    float alpha = glow * (0.6 + spiral * 0.4);
    gl_FragColor = vec4(color, alpha);
  }
`;

export const characterGlowVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;

    vec3 pos = position;
    pos += normal * sin(uTime * 2.0 + position.y * 3.0) * 0.02;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const characterGlowFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = 1.0 - abs(dot(viewDir, vNormal));
    fresnel = pow(fresnel, 2.0);

    float pulse = sin(uTime * 1.5) * 0.15 + 0.85;

    vec3 color = uColor * (0.5 + fresnel * 0.8) * pulse;
    float alpha = (0.3 + fresnel * 0.7) * uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`;

export const timeDistortionVertexShader = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x * 2.0 + uTime) * cos(pos.z * 2.0 + uTime * 0.7) * 0.3;
    pos.y += wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const timeDistortionFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float pattern = sin(vUv.x * 20.0 + uTime * 2.0) * sin(vUv.y * 20.0 + uTime * 1.5);
    pattern = pattern * 0.5 + 0.5;

    vec3 color = uColor * (0.3 + pattern * 0.7);
    float alpha = 0.1 + pattern * 0.2;

    gl_FragColor = vec4(color, alpha);
  }
`;
