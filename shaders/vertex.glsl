
varying vec2 vUv;
void main()
{
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modelPosition.z = sin(position.y * 20.) * 10.;

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
}
