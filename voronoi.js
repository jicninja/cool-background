// noprotect
// ref: https://www.shadertoy.com/view/ldl3W8

const voronoi = `
	// This software is based on Inigo Quilez's work, which is licensed under the MIT License.
	// Original Work: https://www.shadertoy.com/view/ldl3W8
	// Original License: MIT License. Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	// See Inigo Quilez's Articles for details: https://iquilezles.org/articles/voronoilines
	//
	// This modification is also licensed under the MIT License.
	//
	// MIT License
	// Copyright © 2023 Zaron
	// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	// Feel free to replace the hash function with your own
	float hash1(vec2 uv) {
		return fract(sin(dot(uv, vec2(1234.5678, 567.8901)))*12345.67);
	}

	vec2 hash2(vec2 uv) {
		float x = hash1(uv);
		return vec2(x, hash1(uv+x));
	}

	vec3 hash3(vec2 uv) {
		vec2 xy = hash2(uv);
		return vec3(xy, hash1(uv+xy));
	}

	// Calculate smooth minimum
	float smin(float a, float b, float t) {
		float c = clamp(.5+(a-b)/t, 0., 1.);
		return (1.-c)*(a-.5*t*c)+c*b;
	}

	//	Input:
	//		t: animate
	//		mt: smooth minimum effect scale
	//	Output:
	//		moff: offset from current grid to the grid where the closest point is
	//		mdst: distances
	//		midst: interior distances
	vec4 voronoi(vec2 uv, vec2 t, float mt) {
		#define TAU 6.28318530718

		vec2 fuv = fract(uv);
		vec2 iuv = floor(uv);
		
		vec2 moff, mdir, off, pos, dir;
		float dst, idst;
		
		float mdst = 8.;
		for (int x = -1; x <= 1; x++)
		for (int y = -1; y <= 1; y++) {
			off = vec2(float(x), float(y));
			pos = hash2(iuv+off);
			pos = .5+.49*sin(t+pos*TAU);
			dir = pos+off-fuv;
			dst = dot(dir, dir);
			if (dst < mdst) {
				mdst = dst;
				moff = off;
				mdir = dir;
			}
		}
		
		float midst = 8.;
		for (int x = -2; x <= 2; x++)
		for (int y = -2; y <= 2; y++) {
			off = moff+vec2(float(x), float(y));
			pos = hash2(iuv+off);
			pos = .5+.49*sin(t+pos*TAU);
			dir = pos+off-fuv;
			if (dot(mdir-dir, mdir-dir) > 0.00001) {
				idst = dot(.5*(mdir+dir), normalize(dir-mdir));
				midst = smin(midst, idst, abs(mt));
			}
		}
		
		return vec4(moff, mdst, midst);
	}
`
