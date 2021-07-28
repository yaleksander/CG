import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
		initCamera,
		InfoBox,
		onWindowResize} from "../libs/util/util.js";

var keyboard = new KeyboardState();

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

//=================================================================================================
//
//  Sobrou tempo, entao resolvi deixar o comentario numa caixa estilosa
//
//-------------------------------------------------------------------------------------------------
//  Com direito a descricao/subtitulo
//-------------------------------------------------------------------------------------------------

var cylGeo = new THREE.CylinderGeometry(1, 1, 3, 32, 1, true);
var cirGeo = new THREE.CircleGeometry(1, 32);

var loader = new THREE.TextureLoader();
var wood1 = new THREE.MeshBasicMaterial({ map: loader.load("../assets/textures/wood.png") });
var wood2 = new THREE.MeshBasicMaterial({ map: loader.load("../assets/textures/woodtop.png") });

var cylinder = new THREE.Mesh(cylGeo, wood1);
var top      = new THREE.Mesh(cirGeo, wood2);
var bottom   = new THREE.Mesh(cirGeo, wood2);

cylinder.rotation.set(Math.PI / 2, 0, 0);
bottom.rotation.set(Math.PI, 0, 0);
bottom.position.set(0, 0, -1.5);
top.position.set(0, 0, 1.5);

var wood = new THREE.Group();
wood.add(cylinder);
wood.add(top);
wood.add(bottom);

scene.add(wood);

// Use this to show information onscreen
var controls = new InfoBox();
controls.add("Textura Simples");
controls.addParagraph();
controls.add("Use o mouse para controlar a camera");
controls.add("Use QWE, ASD e ZXC para rotacionar o objeto");
controls.show();

// Listen window size changes
window.addEventListener('resize', function(){onWindowResize(camera, renderer)}, false);

buildInterface();

function buildInterface()
{
	//------------------------------------------------------------
	// Interface
	var controls = new function ()
	{
		// Valores iniciais
		this.viewAxes = true;

		// Funcoes
		this.onViewAxes = function()
		{
			axesHelper.visible = this.viewAxes;
		};
	};

	// Elementos de interface
	var gui = new GUI();
	gui.add(controls, 'viewAxes', true)
		.name("Mostrar eixos")
		.onChange(function(e) { controls.onViewAxes() });
}

function keyboardUpdate()
{
	keyboard.update();
	if (keyboard.pressed("Q"))
		wood.rotation.x += 0.05;
	if (keyboard.pressed("W"))
		wood.rotation.x = 0;
	if (keyboard.pressed("E"))
		wood.rotation.x -= 0.05;
	wood.rotation.x %= (Math.PI * 2);
	if (keyboard.pressed("A"))
		wood.rotation.y += 0.05;
	if (keyboard.pressed("S"))
		wood.rotation.y = 0;
	if (keyboard.pressed("D"))
		wood.rotation.y -= 0.05;
	wood.rotation.y %= (Math.PI * 2);
	if (keyboard.pressed("Z"))
		wood.rotation.z += 0.05;
	if (keyboard.pressed("X"))
		wood.rotation.z = 0;
	if (keyboard.pressed("C"))
		wood.rotation.z -= 0.05;
	wood.rotation.z %= (Math.PI * 2);
}

render();
function render()
{
	stats.update(); // Update FPS
	trackballControls.update(); // Enable mouse movements
	keyboardUpdate();
	requestAnimationFrame(render);
	renderer.render(scene, camera) // Render scene
}
