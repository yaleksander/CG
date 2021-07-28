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

var arToolkitSource = new ARjs.Source({ sourceType : 'webcam' });

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

var loader = new GLTFLoader();
var hiroScene  = new THREE.Group();
var kanjiScene = new THREE.PointLight(0xf2ca00, 10, 100);

loader.load("assets/turret/scene.gltf", function (gltf)
{
	gltf.scene.position.set(0, 2.7, 0);
	gltf.scene.scale.set(0.25, 0.25, 0.25);
	hiroScene.add(gltf.scene);
});

scene.add(hiroScene);
scene.add(kanjiScene);
scene.add(new THREE.AmbientLight(0x404040));

// -----------------------------------------------------------------------------

var hiroMarker  = new ARjs.MarkerControls(arToolkitContext, hiroScene, {
	type : 'pattern',
	patternUrl : '../libs/AR/data/patt.hiro'
});

var kanjiMarker = new ARjs.MarkerControls(arToolkitContext, kanjiScene, {
	type : 'pattern',
	patternUrl : '../libs/AR/data/patt.kanji'
});

// -----------------------------------------------------------------------------

render();
function render()
{
//	console.log(hiroScene.getWorldPosition());
	if (arToolkitSource.ready === true)
		arToolkitContext.update(arToolkitSource.domElement);
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
