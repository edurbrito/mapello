attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler2;

uniform float sizeM;
uniform float sizeN;
uniform float m;
uniform float n;


void main() {
    
   // calculate gl_position
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

   // calculate ST (vec2) coordinates based on [c,l] and [sizet_c, size_l] 
   vTextureCoord = vec2(aTextureCoord[0]/sizeM + m/sizeM, aTextureCoord[1]/sizeN + n/sizeN);

}