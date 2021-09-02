//=========================================================================================================
//  SHADER ISLAND II
//=========================================================================================================
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
import vshader from "./vertexShader.glsl.js";
import fshader from "./fragmentShader.glsl.js";

// GLOBAL VARIABLES
var container, scene, camera, renderer, controls, stats, cameraHolder;
var clock = new THREE.Clock();
var loader = new THREE.TextureLoader();
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
//	renderer.setClearColor(new THREE.Color(0x1177aa));
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	renderer.xr.enabled = true;
	container = document.getElementById("container");
	container.appendChild(VRButton.createButton(renderer));

    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

	// BASIC LIGHT
//	scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
	var light = new THREE.PointLight(0xffffff);
	light.position.set(base / 2, height * 1.25, 0); // em função do tamanho da ilha
	light.castShadow = true;
//	scene.add(light);

	// ADD ISLAND
	var ground = island(base, height, 600, 600, 50);
	scene.add(ground);

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
	var water = new THREE.Mesh(ground.geometry, waterMat);
	water.rotation.x = -Math.PI / 2;
	water.position.y = -height / 4; // em função da altura da ilha
	scene.add(water);

	// STARTING POSITION
	cameraHolder.position.set(0, height, base / 2); // em função da altura da ilha
}

function island(b, h, u, v, s, m)
{
	// TEXTURES
	var tex = [];
	var bumpTexture = loader.load("images/heightmap.png");
	var normalTexture = loader.load("images/normalmap.png");
	for (var i = 0; i < 5; i++)
	{
		tex.push(loader.load("images/tex" + i.toString() + ".jpg"));
		tex[i].wrapS = tex[i].wrapT = THREE.RepeatWrapping;
	}

	// GLSL UNIFORMS
	var lightDir = new THREE.Vector3(5, -2, 1);
	var customUniforms =
	{
		bumpTexture:    { type: "t", value: bumpTexture          },
		normalTexture:  { type: "t", value: normalTexture        },
		bumpScale:      { type: "f", value: h                    },
		mapScale:       { type: "f", value: s                    },
		tex1:           { type: "t", value: tex[0]               },
		tex2:           { type: "t", value: tex[1]               },
		tex3:           { type: "t", value: tex[2]               },
		tex4:           { type: "t", value: tex[3]               },
		tex5:           { type: "t", value: tex[4]               },
		lightDirection: {            value: lightDir.normalize() }
	};

	// SHADER MATERIAL
	var customMaterial = new THREE.ShaderMaterial(
	{
	    uniforms: customUniforms,
		vertexShader: vshader,
		fragmentShader: fshader
	});

	// SHADER ISLAND
	var planeGeo = new THREE.PlaneGeometry(b, b, u, v);
	var plane = new THREE.Mesh(planeGeo, customMaterial);
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = -h / 2; // em função da altura da ilha
	plane.geometry.computeVertexNormals();
//	plane.castShadow = true;
//	plane.receiveShadow = true;
	return plane;
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
