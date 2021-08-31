//=========================================================================================================
//  SHADER ISLAND II
//---------------------------------------------------------------------------------------------------------
//  Aleksander Yacovenco
//  Mestrado em Computação Gráfica UFJF
//  Realidade Virtual e Aumentada 2021/2
//  Prof. Rodrigo Luis
//---------------------------------------------------------------------------------------------------------
//  Feito com base no exemplo disponível em:
//  https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Shader-Heightmap-Textures.html
//=========================================================================================================

// MODULES
import * as THREE   from "../build/three.module.js";
import { VRButton } from '../build/jsm/webxr/VRButton.js';
import Stats        from "../build/jsm/libs/stats.module.js";

// SHADERS (AS MODULES)
import vshader from "./vertexShader.glsl.js"
import fshader from "./fragmentShader.glsl.js"

// GLOBAL VARIABLES
var container, scene, camera, renderer, controls, stats, cameraHolder;
var clock = new THREE.Clock();
var moveCamera = false;

// CUSTOM VALUES
const base   = 5000.0;
const height =  650.0;
const speed  =    6.0;

// START
init();
animate();

function init()
{
	// SCENE
	scene = new THREE.Scene();

	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	// RENDER
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor(new THREE.Color(0x4696f0));
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	renderer.xr.enabled = true;
	container = document.getElementById("container");
	container.appendChild(VRButton.createButton(renderer));

	// CAMERA OBJECT
	cameraHolder = new THREE.Object3D();
	cameraHolder.add(camera);
	scene.add(cameraHolder);

	// CONTROLS
	controls = renderer.xr.getController(0);
	controls.addEventListener("selectstart", onSelectStart);
	controls.addEventListener("selectend", onSelectEnd);
	cameraHolder.add(controls);

	// STATS
	stats = new Stats();
	stats.domElement.style.position = "absolute";
	stats.domElement.style.bottom = "0px";
	stats.domElement.style.zIndex = 100;
	container.appendChild(stats.domElement);

	// TEXTURES
	var loader = new THREE.TextureLoader();
	var bumpTexture = loader.load("heightmap.png");
	var oceanTexture = loader.load("images/rock0.jpg");
	var sandyTexture = loader.load("images/rock1.jpg");
	var grassTexture = loader.load("images/rock2.jpg");
	var rockyTexture = loader.load("images/rock3.jpg");
	var snowyTexture = loader.load("images/moss1.jpg");
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
	oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping;
	sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping;
	grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
	rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping;
	snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping;

	// GLSL UNIFORMS
	var customUniforms =
	{
		bumpTexture:  { type: "t", value: bumpTexture  },
		bumpScale:    { type: "f", value: height       },
		oceanTexture: { type: "t", value: oceanTexture },
		sandyTexture: { type: "t", value: sandyTexture },
		grassTexture: { type: "t", value: grassTexture },
		rockyTexture: { type: "t", value: rockyTexture },
		snowyTexture: { type: "t", value: snowyTexture },
	};

	// SHADER MATERIAL
	var customMaterial = new THREE.ShaderMaterial(
	{
	    uniforms: customUniforms,
		vertexShader: vshader,
		fragmentShader: fshader,
	});

	// SHADER ISLAND
	var w = 816;
	var h = 816;
	var planeGeo = new THREE.PlaneGeometry(base, base, w, h);
	var plane = new THREE.Mesh(planeGeo, customMaterial);
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = -height / 2; // em função da altura da ilha
	scene.add(plane);

	// BASIC LIGHT
	scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
	var light = new THREE.PointLight(0xffffff);
	light.position.set(base / 2, height * 1.25, base / 2); // em função do tamanho da ilha
	scene.add(light);

	// BASIC SKYBOX
	var skyBoxGeometry = new THREE.BoxGeometry(20000, 20000, 10000);
	var skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
	var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
	scene.add(skyBox);

	// BASIC WATER
	var waterGeo = new THREE.PlaneGeometry(1000, 1000, 1, 1);
	var waterTex = loader.load("images/water512.jpg");
	waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping;
	waterTex.repeat.set(5, 5);
	var waterMat = new THREE.MeshBasicMaterial({ map: waterTex, transparent: true, opacity: 0.40 });
	var water = new THREE.Mesh(	planeGeo, waterMat);
	water.rotation.x = -Math.PI / 2;
	water.position.y = -height / 4; // em função da altura da ilha
	scene.add(water);

	// STARTING POSITION
	cameraHolder.position.set(0, height, base / 2); // em função da altura da ilha
}

function move()
{
	if (moveCamera)
	{
		var quaternion = new THREE.Quaternion();
		quaternion = camera.quaternion;
		var moveTo = new THREE.Vector3(0, 0, -1);
		moveTo.applyQuaternion(quaternion);
		cameraHolder.translateOnAxis(moveTo, speed);
	}
}

function onSelectStart()
{
	moveCamera = true;
}

function onSelectEnd()
{
	moveCamera = false;
}

function animate()
{
	renderer.setAnimationLoop(render);
}

function render()
{
	move();
	stats.update();
	renderer.render(scene, camera);
}
