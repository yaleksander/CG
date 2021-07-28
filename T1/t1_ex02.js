import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
		initCamera,
		InfoBox,
		onWindowResize} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(20, 20);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
	color: "rgba(150, 150, 150)",
	side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

// cria formas geometricas
var cubGeo = new THREE.BoxGeometry(4, 4, 4);
var cylGeo = new THREE.CylinderGeometry(2, 2, 4, 16);
var sphGeo = new THREE.SphereGeometry(2, 16, 16);
var material = new THREE.MeshNormalMaterial();
var cub = new THREE.Mesh(cubGeo, material);
var cyl = new THREE.Mesh(cylGeo, material);
var sph = new THREE.Mesh(sphGeo, material);
//var rot = new THREE.Euler(0, 90, 0);
// posiciona as formas
cub.position.set(6.0, 0.0, 2.0);
cyl.position.set(0.0, 0.0, 2.0);
sph.position.set(0.0, 6.0, 2.0);
// rotaciona o cilindro 90 graus (pi / 2 rad)
cyl.rotation.set(1.57, 0, 0);
// adiciona as formas a cena
scene.add(cub);
scene.add(cyl);
scene.add(sph);

// Use this to show information onscreen
var controls = new InfoBox();
	controls.add("Basic Scene");
	controls.addParagraph();
	controls.add("Use mouse to interact:");
	controls.add("* Left button to rotate");
	controls.add("* Right button to translate (pan)");
	controls.add("* Scroll to zoom in/out.");
	controls.show();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
function render()
{
	stats.update(); // Update FPS
	trackballControls.update(); // Enable mouse movements
	requestAnimationFrame(render);
	renderer.render(scene, camera) // Render scene
}