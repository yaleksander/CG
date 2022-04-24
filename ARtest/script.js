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

var arToolkitSource = new ARjs.Source({ sourceType: 'image', sourceUrl: 'assets/kanjiScene.jpg' });
//var arToolkitSource = new ARjs.Source({sourceType: 'webcam', sourceWidth: 1280, sourceHeight: 720});

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

var loader     = new THREE.TextureLoader();
var kanjiScene = new THREE.Group();
var texture = loader.load("assets/42.png");

var planeGeo = new THREE.PlaneGeometry(1, 1);
var planeMat = new THREE.MeshStandardMaterial({map: texture, side: THREE.DoubleSide});
var plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.set(-Math.PI / 2, 0, 0);
plane.position.set(0, 0.5, 0);
kanjiScene.add(plane);
scene.add(kanjiScene);
scene.add(new THREE.AmbientLight(0xeeeeee, 0.75));

// -----------------------------------------------------------------------------
/*
var hiroMarker  = new ARjs.MarkerControls(arToolkitContext, hiroScene, {
	type : 'pattern',
	patternUrl : '../libs/AR/data/patt.hiro'
});
*/
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
