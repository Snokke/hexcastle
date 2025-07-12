export const SmokeVertexShader = `
    uniform float uTime;
    varying vec2 vUv;
    uniform sampler2D uPerlinTexture;
    
    vec2 rotate2D(vec2 value, float angle)
    {
        float s = sin(angle);
        float c = cos(angle);
        mat2 m = mat2(c, s, -s, c);
        return m * value;
    }

    void main() {
        vec3 newPosition = position;

        // Twist
        float twistPerlin = texture(
            uPerlinTexture,
            vec2(0.5, uv.y * 0.2 - uTime * 0.005)
        ).r;
        float angle = twistPerlin * 10.0;
        newPosition.xz = rotate2D(newPosition.xz, angle);

        // Wind
        vec2 windOffset = vec2(
            texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
            texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
        );
        windOffset *= pow(uv.y, 2.0) * 2.0;
        newPosition.xz += windOffset;

        // Final position
        vec4 instancePosition = instanceMatrix * vec4(newPosition, 1.0);
        vec4 worldPosition = modelMatrix * instancePosition;
        
        vec4 viewPosition = viewMatrix * worldPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        
        gl_Position = projectedPosition;

        vUv = uv;
    }
`;

export const SmokeFragmentShader = `
    uniform float uTime;
    uniform sampler2D uPerlinTexture;
    varying vec2 vUv;
    
    void main() {
        vec2 smokeUv = vUv;
        smokeUv.x *= 0.3;
        smokeUv.y *= 0.5;
        smokeUv.y -= uTime * 0.03;

        float smoke = texture(uPerlinTexture, smokeUv).r;

        smoke = smoothstep(0.1, 1.0, smoke);

        smoke *= smoothstep(0.0, 0.15, vUv.x);
        smoke *= smoothstep(1.0, 0.85, vUv.x);
        smoke *= smoothstep(0.0, 0.1, vUv.y);
        smoke *= smoothstep(1.0, 0.4, vUv.y);

        gl_FragColor = vec4(1.0, 1.0, 1.0, smoke);

        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }
`; 