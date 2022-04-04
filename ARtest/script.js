import * as THREE   from '../build/three.module.js';
import {ARjs}       from "../libs/AR/ar.js";
import {GLTFLoader} from "../build/jsm/loaders/GLTFLoader.js";

var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera();
scene.add(camera);

//var arToolkitSource = new ARjs.Source({ sourceType: 'image', sourceUrl: 'assets/kanjiScene.jpg' });
var arToolkitSource = new ARjs.Source({sourceType: 'webcam', sourceWidth: 1280, sourceHeight: 720});

arToolkitSource.init(function onReady(){ setTimeout(() => { onResize() }, 2000); });

window.addEventListener('resize', function() { onResize() });

function onResize()
{
	arToolkitSource.onResizeElement()
	arToolkitSource.copyElementSizeTo(renderer.domElement)
	if (arToolkitContext.arController !== null)
		arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
}

// -----------------------------------------------------------------------------

var arToolkitContext = new ARjs.Context({
	cameraParametersUrl: '../libs/AR/data/camera_para.dat',
	detectionMode: 'mono'
})

// initialize it
arToolkitContext.init(function onCompleted()
{
	camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

// -----------------------------------------------------------------------------

var loader     = new GLTFLoader();
var hiroScene  = new THREE.Group();
/*
var kanjiScene = new THREE.Group();
var sphereGeo  = new THREE.SphereGeometry(0.2, 32, 16);
var sphereMat  = new THREE.MeshBasicMaterial({color: 0xf59342});
var sphere     = new THREE.Mesh(sphereGeo, sphereMat);
*/
var raycaster  = new THREE.Raycaster();
var mouse      = new THREE.Vector2();

/*
kanjiScene.add(sphere);
kanjiScene.add(new THREE.PointLight(0xffffff, 5));

loader.load("assets/barrel/scene.gltf", function (gltf)
{
	gltf.scene.position.set(0.3, 1.5, -2);
	gltf.scene.rotation.set(-0.05, -0.15, 0);
	gltf.scene.scale.set(3, 3, 3);
	hiroScene.add(gltf.scene);
});
*/
var planeGeo = new THREE.PlaneGeometry(5, 5);
//var planeGeo = new THREE.BoxGeometry(50, 0.1, 50);
//var planeMat = new THREE.MeshBasicMaterial({color: 0x444211, opacity: 0.1});
var planeMat = new THREE.MeshBasicMaterial({color: 0x222100, opacity: 0.05});
var plane = new THREE.Mesh(planeGeo, planeMat);
var cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
var cubeMat = new THREE.MeshBasicMaterial({color: 0xf5a142, opacity: 0.1});
var wireMat = new THREE.MeshBasicMaterial({color: 0xf5a142, wireframe: true});
var cube = new THREE.Mesh(cubeGeo, cubeMat);
var wire = new THREE.Mesh(cubeGeo, wireMat);
var sphereGeo = new THREE.SphereGeometry(0.2);
var sphereMat = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5});
var sphere = new THREE.Mesh(sphereGeo, sphereMat);
//sphere.position.set(-50, -50, -50);
plane.rotation.set(-Math.PI / 2, 0, 0);
//plane.position.set(0, -0.5, -2.2);
cube.position.set(0, 0.25, 0);
wire.position.set(0, 0.25, 0);
hiroScene.add(plane);
hiroScene.add(cube);
hiroScene.add(wire);
hiroScene.add(sphere);

var angle  = 0;
var height = 0;
var light = new THREE.PointLight(0xffffff, 5);
light.rotation.set(-0.05, -0.15, 0);
hiroScene.add(light);

scene.add(hiroScene);
//scene.add(kanjiScene);
scene.add(new THREE.AmbientLight(0xaaaaaa));
//scene.add(new THREE.AmbientLight(0xffffff, 9999));
//scene.add(new THREE.PointLight(0xffffff, 9999));

// -----------------------------------------------------------------------------

var hiroMarker  = new ARjs.MarkerControls(arToolkitContext, hiroScene, {
	type : 'pattern',
	patternUrl : '../libs/AR/data/patt.kanji'
});
/*
var kanjiMarker = new ARjs.MarkerControls(arToolkitContext, kanjiScene, {
	type : 'pattern',
	patternUrl : '../libs/AR/data/patt.kanji'
});
*/
// -----------------------------------------------------------------------------

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event)
{
	var keyCode = event.which;
	switch (keyCode)
	{
		case 37: // left
			angle += 0.1;
			break;

		case 38: // up
			height += 0.1;
			break;

		case 39: // right
			angle -= 0.1;
			break;

		case 40: // down
			height -= 0.1;
			break;
	}
	light.position.set(0.3 + 10 * Math.cos(angle), 1.5 + height, -2 + 10 * Math.sin(angle));
}

document.addEventListener("mousedown", onDocumentMouseDown, false);
function onDocumentMouseDown(event)
{
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	// event.preventDefault();

	switch (event.button)
	{
		case 0: // left
			mouse.x =  (event.clientX / window.innerWidth)  * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//			mouse.x =  (event.clientX / renderer.domElement.clientWidth)  * 2 - 1;
//			mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
//			raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
			raycaster.setFromCamera(mouse, camera);
			var i = raycaster.intersectObject(plane);
			console.log(i);
			console.log(i[0].point.x, i[0].point.y, i[0].point.z);
			console.log(raycaster);
			sphere.position.x = i[0].point.x;
			sphere.position.y = i[0].point.y;
			sphere.position.z = i[0].point.z;
			break;
	}
}

render();
function render()
{
//	console.log(hiroScene.getWorldPosition());
	if (arToolkitSource.ready === true)
		arToolkitContext.update(arToolkitSource.domElement);
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
