const shader =
`
uniform sampler2D oceanTexture;
uniform sampler2D sandyTexture;
uniform sampler2D grassTexture;
uniform sampler2D rockyTexture;
uniform sampler2D snowyTexture;

varying vec2 vUV;

varying float vAmount;

void main()
{
	vec4 water = (smoothstep(0.01, 0.25, vAmount) - smoothstep(0.20, 0.30, vAmount)) * texture2D( oceanTexture, vUV * 100.0 );
	vec4 sandy = (smoothstep(0.20, 0.40, vAmount) - smoothstep(0.35, 0.45, vAmount)) * texture2D( sandyTexture, vUV *  50.0 );
	vec4 grass = (smoothstep(0.35, 0.50, vAmount) - smoothstep(0.45, 0.55, vAmount)) * texture2D( grassTexture, vUV *  50.0 );
	vec4 rocky = (smoothstep(0.45, 0.55, vAmount) - smoothstep(0.50, 0.60, vAmount)) * texture2D( rockyTexture, vUV *  50.0 );
	vec4 snowy = (smoothstep(0.50, 0.60, vAmount))                                   * texture2D( snowyTexture, vUV * 100.0 );
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + water + sandy + grass + rocky + snowy; //, 1.0);
}
`
export default shader
