#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main() {
    
    // fragment color is retrieved from the texture (sampler2D) based on the ST coordinate
    // calculated at the vertex shader.
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}