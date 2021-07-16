import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        degreesToRadians, 
        onWindowResize,
        initDefaultBasicLight} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(15, 15, 21)); // Init camera in this position
var trackballControls = new TrackballControls( camera, renderer.domElement );
initDefaultBasicLight(scene);

var speed = 0.075;
var animationOn = true; // control if animation is on or of

// Show world axes
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// Materiais
var red = new THREE.MeshPhongMaterial({
	color: "rgba(200, 100, 100)",
	side: THREE.FrontSide
});
var green = new THREE.MeshPhongMaterial({
	color: "rgba(100, 200, 100)",
	side: THREE.FrontSide
});
var blue = new THREE.MeshPhongMaterial({
	color: "rgba(100, 100, 200)",
	side: THREE.FrontSide
});
var white = new THREE.MeshPhongMaterial({
	color: "rgba(200, 200, 200)",
	side: THREE.FrontSide
});
var normal = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide
});

// Mesmo plano visto em exemplos anteriores
var planeGeometry = new THREE.PlaneGeometry(20, 20);
planeGeometry.translate(1.5, 1.5, 0.02);
var plane = new THREE.Mesh(planeGeometry, normal);
plane.rotation.set(Math.PI / 2, 0, 0)
scene.add(plane);

// Formas geometricas da helice
var boxGeo = new THREE.BoxGeometry(2, 1, 0.25);
var ldiskGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 16, 1, false, Math.PI, Math.PI);
var rdiskGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 16, 1, false, 0, Math.PI);
var stickGeo = new THREE.CylinderGeometry(0.12, 0.12, 2, 16);

var box = new THREE.Mesh(boxGeo, green);
var ldisk = new THREE.Mesh(ldiskGeo, green);
var rdisk = new THREE.Mesh(rdiskGeo, green);
var stick = new THREE.Mesh(stickGeo, green);

box.position.set(2.5, 0.0, 0.0);
ldisk.position.set(1.5, 0.0, 0.0);
rdisk.position.set(3.5, 0.0, 0.0);
stick.position.set(1.0, 0.0, 0.0);

box.rotation.set(-Math.PI / 10, 0, 0);
ldisk.rotation.set(Math.PI * 4 / 10, 0, 0);
rdisk.rotation.set(Math.PI * 4 / 10, 0, 0);
stick.rotation.set(-Math.PI / 10, 0, Math.PI / 2);

var blade1 = new THREE.Group();
blade1.add(box);
blade1.add(ldisk);
blade1.add(rdisk);
blade1.add(stick);

var blade2 = blade1.clone();
blade2.rotation.set(0, 0, Math.PI * 2 / 3);

var blade3 = blade1.clone();
blade3.rotation.set(0, 0, Math.PI * -2 / 3);

var tipGeo = new THREE.CylinderGeometry(0.5, 0.125, 0.8, 16);
var wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16, 1, true);
var tip = new THREE.Mesh(tipGeo, blue);
var wheel = new THREE.Mesh(wheelGeo, blue)
tip.position.set(0, 0, -0.2);
wheel.position.set(0, 0, 0.2);
tip.rotation.set(Math.PI / 2, 0, 0);
wheel.rotation.set(Math.PI / 2, 0, 0);

var fan = new THREE.Group();
fan.add(blade1);
fan.add(blade2);
fan.add(blade3);
fan.add(tip);
fan.add(wheel);

// Formas geometricas da base
var baseGeo = new THREE.BoxGeometry(3, 1, 3);
var poleGeo = new THREE.CylinderGeometry(0.35, 0.35, 6, 16, 1, true);
var topGeo = new THREE.BoxGeometry(1, 1, 2);

var base = new THREE.Mesh(baseGeo, red);
var pole = new THREE.Mesh(poleGeo, white);
var top = new THREE.Mesh(topGeo, blue);

base.position.set(1.5, 0.5, 1.5);
pole.position.set(1.5, 3.5, 1.5);
top.position.set(1.5, 7, 1.1);

fan.position.set(1.5, 7, 2.4);
fan.rotation.set(0, Math.PI, 0);

// Adiciona tudo a cena
scene.add(base);
scene.add(pole);
scene.add(top);
scene.add(fan);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

buildInterface();
render();

function rotateCylinder()
{
	if (animationOn)
	{
		fan.rotation.z -= speed;
		if (fan.rotation.z < -Math.PI * 2)
			fan.rotation.z += Math.PI * 2;
	}
}

function buildInterface()
{
	var controls = new function ()
	{
		this.onChangeAnimation = function()
		{
			animationOn = !animationOn;
		};
		this.speed = 0.075;

		this.changeSpeed = function()
		{
			speed = this.speed;
		};
	};

	// GUI interface
	var gui = new GUI();
	gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");
	gui.add(controls, 'speed', 0.01, 0.2)
		.onChange(function(e) { controls.changeSpeed() })
		.name("Change Speed");
}

function render()
{
	stats.update(); // Update FPS
	trackballControls.update();
	rotateCylinder();
	requestAnimationFrame(render);
	renderer.render(scene, camera) // Render scene
}
