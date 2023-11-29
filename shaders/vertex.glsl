
varying vec2 vUv;
varying vec3 newPosition;


void main()
{
    vUv = uv;

    newPosition = position;
    
    float dist = ( modelMatrix * vec4(position, 1.0)).x;
    
    newPosition.y *= pow(abs(dist * 0.0009), 1.6) + 1.6;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

}
