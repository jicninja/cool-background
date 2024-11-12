// Basic structure ref: https://itp-xstory.github.io/p5js-shaders/#/./docs/setting-up-shaders-in-p5

let theShader;
let WebGL;
let Canvas;
let img;

function preload(){
	theShader = new p5.Shader(this.renderer, vert, frag);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	pixelDensity(1);
	WebGL = createGraphics(width, height, WEBGL);
	Canvas = createGraphics(width, height);
	noStroke();
	WebGL.noStroke();
  Canvas.noStroke();
  WebGL.background(0);
  Canvas.background(0);
}

function draw() {
	WebGL.shader(theShader);

	theShader.setUniform('iResolution', [width, height]);
	theShader.setUniform('iPixelDensity', pixelDensity());
	theShader.setUniform('iCanvas', Canvas);
	theShader.setUniform('iMouse', [mouseX, mouseY]);
	theShader.setUniform('iTime', frameCount);

	WebGL.rect(0, 0, width, height);
	
	image(WebGL, 0, 0);
}
