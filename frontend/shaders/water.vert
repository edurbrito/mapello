attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

void main() {
    vec3 offset=vec3(0.0,0.0,0.0);

    vTextureCoord = aTextureCoord;
    vec2 offsetWaves = vec2(mod(vTextureCoord.x + sin(timeFactor*0.01),1.0), mod(vTextureCoord.y + sin(timeFactor*0.01),1.0));

    offset = aVertexNormal * texture2D(uSampler2, offsetWaves).b * 0.03 * sin(timeFactor * 0.5);

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}

