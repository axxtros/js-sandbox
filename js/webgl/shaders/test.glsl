#ifdef GL_ES
	precision mediump float;
#endif

uniform float u_time;

void main() {
	gl_FragColor = vec4(1.0,0.0,0.0,1.0);
	gl_FragColor = vec4(abs(sin(u_time)),0.0,0.0,1.0);
	vec4 color = vec4(vec3(1.0,0.0,1.0),1.0);
}