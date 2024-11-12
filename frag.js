// noprotect

const frag = `
	#ifdef GL_ES
	precision mediump float;
	#endif

	uniform vec2 iResolution;
	uniform float iPixelDensity;
	uniform sampler2D iCanvas;
	uniform vec2 iMouse;
	uniform float iTime;

	${ voronoi }
	${ snoise3D }
	${ snoise3DImage }
	${ gradient }
	${ Palette }

	vec2 rotate(vec2 uv, float angle) {
		float s = sin(angle);
		float c = cos(angle);
		mat2 rot = mat2(c, -s, s, c);
		return rot*uv;
	}

	float dust(vec2 uv, float oriChannel, float dustChannel, float wei) {
		oriChannel += dustChannel*wei;
		return oriChannel-wei/2.;
	}

	varying vec2 vTexCoord;
	void main() {
		vec2 uv = vTexCoord;
		vec2 mo = iMouse.xy/iResolution.xy;
		uv -= .5;
		uv.x *= iResolution.x/iResolution.y;
		
		uv *= 20.-10.*sin(iTime*0.005);
		
		uv = rotate(uv, sin(iTime*0.01));
		
		vec3 col = vec3(0.);
		vec4 voro = voronoi(uv, vec2(iTime*0.025), .1);
		float noise = snoise3DImage(uv, 1000., 2., 0.5, vec3(0.)).r;
		
		float rad = radial((floor(uv)+voro.xy), vec2(0.), .05, iTime*0.005);
		rad = clamp(rad, .05, 1.);
		rad /= voro.w;
		rad -= voro.z;
		rad = dust(uv, rad, noise, 0.15);
		
		gl_FragColor = vec4(Palette(vec2(rad)).rgb, 1.);
	}
`
