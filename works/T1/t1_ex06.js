import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        InfoBox,
        SecondaryBox,
        createGroundPlane,
        onWindowResize, 
        degreesToRadians, 
        createLightSphere} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(2.18, 1.62, 3.31);
  camera.up.set( 0, 1, 0 );
var objColor = "rgb(255,20,20)";
var objShininess = 200;

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlane(4.0, 2.5, 50, 50); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 1.5 );
  axesHelper.visible = false;
scene.add( axesHelper );

// Show text information onscreen
showInformation();

// Boolean para fazer a chaleira girar
var spinOn = false;

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// Barras
var br = 0.025;
var bh = 0.8 - br;
var barGeo1 = new THREE.CylinderGeometry(br, br, 2 * bh, 16, 50, true);
var barGeo2 = new THREE.CylinderGeometry(br, br, 2.5 - 2 * br, 16, 50, true);
var barGeo3 = new THREE.CylinderGeometry(br, br, 4.0 - 2 * br, 16, 50, true);
var sphGeo1 = new THREE.SphereGeometry(br, 16, 16);
var sphGeo2 = new THREE.SphereGeometry(br * 2, 16, 16);
var white = new THREE.MeshPhongMaterial({color:"rgba(255, 255, 255)", shininess:"200", side: THREE.DoubleSide});
var gray1 = new THREE.MeshPhongMaterial({color:"rgba(70, 70, 70)"});
var gray2 = new THREE.MeshPhongMaterial({color:"rgba(110, 110, 110)"});
var red = new THREE.MeshPhongMaterial({color:"rgba(255, 0, 0)"});
var green = new THREE.MeshPhongMaterial({color:"rgba(0, 255, 0)"});
var blue = new THREE.MeshPhongMaterial({color:"rgba(0, 0, 255)"});

var vBar1 = new THREE.Mesh(barGeo1, gray1);
var vBar2 = new THREE.Mesh(barGeo1, gray1);
var vBar3 = new THREE.Mesh(barGeo1, gray1);
var vBar4 = new THREE.Mesh(barGeo1, gray1);
var hBar1 = new THREE.Mesh(barGeo2, gray1);
var hBar2 = new THREE.Mesh(barGeo2, gray1);
var hBar3 = new THREE.Mesh(barGeo3, gray1);
var sph1 = new THREE.Mesh(sphGeo1, gray1);
var sph2 = new THREE.Mesh(sphGeo1, gray1);
var sph3 = new THREE.Mesh(sphGeo1, gray1);
var sph4 = new THREE.Mesh(sphGeo1, gray1);
var sr = new THREE.Mesh(sphGeo2, red);
var sg = new THREE.Mesh(sphGeo2, green);
var sb = new THREE.Mesh(sphGeo2, blue);

vBar1.position.set(2.0 - br, bh, 1.25 - br);
vBar2.position.set(2.0 - br, bh, br - 1.25);
vBar3.position.set(br - 2.0, bh, br - 1.25);
vBar4.position.set(br - 2.0, bh, 1.25 - br);
hBar1.position.set(2.0 - br, bh * 2, 0);
hBar2.position.set(br - 2.0, bh * 2, 0);
hBar3.position.set(0, bh * 2, 1.25 - br);
sph1.position.set(2.0 - br, bh * 2, 1.25 - br);
sph2.position.set(2.0 - br, bh * 2, br - 1.25);
sph3.position.set(br - 2.0, bh * 2, br - 1.25);
sph4.position.set(br - 2.0, bh * 2, 1.25 - br);


hBar1.rotation.set(Math.PI / 2, 0, 0);
hBar2.rotation.set(Math.PI / 2, 0, 0);
hBar3.rotation.set(0, 0, Math.PI / 2);

scene.add(vBar1);
scene.add(vBar2);
scene.add(vBar3);
scene.add(vBar4);
scene.add(hBar1);
scene.add(hBar2);
scene.add(hBar3);
scene.add(sph1);
scene.add(sph2);
scene.add(sph3);
scene.add(sph4);
scene.add(sr);
scene.add(sg);
scene.add(sb);

// Teapot
var teaGeo = new TeapotGeometry(0.5);
var tea = new THREE.Mesh(teaGeo, white);
tea.castShadow = true;
tea.position.set(0.0, 0.5, 0.0);
scene.add(tea);

//----------------------------------------------------------------------------
//---------------------------------------------------------
// Default light position, color, ambient color and intensity
var lightPosition = new THREE.Vector3(1.7, 0.8, 1.1);
var lightColor = "rgb(255,255,255)";
var ambientColor = "rgb(50,50,50)";

//---------------------------------------------------------
// Create and set all lights. Only Spot and ambient will be visible at first
var rl = new THREE.SpotLight("rgb(255, 0, 0)");
var gl = new THREE.SpotLight("rgb(0, 255, 0)");
var bl = new THREE.SpotLight("rgb(0, 0, 255)");

createSpotLight(rl, sr, 2 - br, 0, "Red Light");
createSpotLight(bl, sb, br - 2, 0, "Blue Light");
createSpotLight(gl, sg, 0, 1.25 - br, "Green Light");

var ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

buildInterface();
render();

// Parametros padrao dos focos de luz
function createSpotLight(light, sphere, x, z, name)
{
	sphere.position.set(x, bh * 2, z);
	light.position.set(x, bh * 2, z);
	light.shadow.mapSize.width = 512;
	light.shadow.mapSize.height = 512;
	light.angle = degreesToRadians(40);    
	light.castShadow = true;
	light.decay = 2;
	light.penumbra = 0.5;
	light.name = name;
	scene.add(light);
}

function buildInterface()
{
	//------------------------------------------------------------
	// Interface
	var controls = new function ()
	{
		// Valores iniciais
		this.viewAxes = false;
		this.ambientLight = true;
		this.spin = false;
		this.redLight = true;
		this.greenLight = true;
		this.blueLight = true;

		// Funcoes
		this.onViewAxes = function()
		{
			axesHelper.visible = this.viewAxes;
		};

		this.onEnableAmbientLight = function()
		{
			ambientLight.visible = this.ambientLight;
		};

		this.onSpin = function()
		{
			spinOn = this.spin;
		};

		this.onRedLight = function()
		{
			rl.visible = this.redLight;
		};

		this.onGreenLight = function()
		{
			gl.visible = this.greenLight;
		};

		this.onBlueLight = function()
		{
			bl.visible = this.blueLight;
		};
	};

	// Elementos de interface
	var gui = new GUI();
	gui.add(controls, 'viewAxes', false)
		.name("View Axes")
		.onChange(function(e) { controls.onViewAxes() });
	gui.add(controls, 'spin', false)
		.name("Spin")
		.onChange(function(e) { controls.onSpin() });
	gui.add(controls, 'ambientLight', true)
		.name("Ambient Light")
		.onChange(function(e) { controls.onEnableAmbientLight() });
	gui.add(controls, 'redLight', true)
		.name("Red Light")
		.onChange(function(e) { controls.onRedLight() });
	gui.add(controls, 'greenLight', true)
		.name("Green Light")
		.onChange(function(e) { controls.onGreenLight() });
	gui.add(controls, 'blueLight', true)
		.name("Blue Light")
		.onChange(function(e) { controls.onBlueLight() });
}

function keyboardUpdate()
{
	keyboard.update();

	// blue light
	if (keyboard.pressed("Q") && sb.position.z > (br * 2 - 1.25))
	{
		sb.position.z -= 0.05;
		bl.position.z -= 0.05;
	}
	if (keyboard.pressed("W"))
	{
		sb.position.z = 0;
		bl.position.z = 0;
	}
	if (keyboard.pressed("E") && sb.position.z < (1.25 - br * 2))
	{
		sb.position.z += 0.05;
		bl.position.z += 0.05;
	}

	// red light
	if (keyboard.pressed("A") && sr.position.z > (br * 2 - 1.25))
	{
		sr.position.z -= 0.05;
		rl.position.z -= 0.05;
	}
	if (keyboard.pressed("S"))
	{
		sr.position.z = 0;
		rl.position.z = 0;
	}
	if (keyboard.pressed("D") && sr.position.z < (1.25 - br * 2))
	{
		sr.position.z += 0.05;
		rl.position.z += 0.05;
	}

	// green light
	if (keyboard.pressed("Z") && sg.position.x > (br * 2 - 2))
	{
		sg.position.x -= 0.05;
		gl.position.x -= 0.05;
	}
	if (keyboard.pressed("X"))
	{
		sg.position.x = 0;
		gl.position.x = 0;
	}
	if (keyboard.pressed("C") && sg.position.x < (2 - br * 2))
	{
		sg.position.x += 0.05;
		gl.position.x += 0.05;
	}
}

function showInformation()
{
	// Use this to show information onscreen
	var controls = new InfoBox();
	controls.add("Luzes Coloridas");
	controls.addParagraph();
	controls.add("Use as teclas QWE, ASD e ZXC para mover as luzes");
	controls.show();
}

function rotateTeapot()
{
	if (spinOn)
	{
		tea.rotation.y += 0.025;
		tea.rotation.y %= (Math.PI * 2);
	}
}

function render()
{
	stats.update();
	trackballControls.update();
	keyboardUpdate();
	rotateTeapot();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
