#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float timeFactor;

void main() {
	float offset = timeFactor * 0.01;
	vec4 color = texture2D(uSampler, vTextureCoord+vec2(offset, offset));
	
	gl_FragColor = color;
}