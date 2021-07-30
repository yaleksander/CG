//=================================================================================================
//  AMBIENTE 01: BASICO
//-------------------------------------------------------------------------------------------------
//  Aleksander Yacovenco
//  Mestrado em Computação Gráfica UFJF
//  Realidade Virtual e Aumentada 2021/2
//  Prof. Rodrigo Luis
//-------------------------------------------------------------------------------------------------
//  Este codigo usa o "t4_ex02.js" como base
//=================================================================================================

//=================================================================================================
//  DECLARACOES E VALORES GLOBAIS
//=================================================================================================

// Imports
import * as THREE         from '../build/three.module.js';
import { VRButton }       from '../build/jsm/webxr/VRButton.js';
import { onWindowResize } from "../libs/util/util.js";
import { GLTFLoader }     from "../build/jsm/loaders/GLTFLoader.js";

// General globals
let raycaster = new THREE.Raycaster(); // Raycaster to enable selection and dragging
let group = new THREE.Group();         // Objects of the scene will be added in this group
const intersected = [];                // will be used to help controlling the intersected objects
window.addEventListener( 'resize', onWindowResize );

// Renderer and html settings
let renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor(new THREE.Color("rgb(70, 150, 240)"));
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	renderer.xr.enabled = true;

// Setting scene and camera
var scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 30 );

// Create VR button and settings
document.body.appendChild( VRButton.createButton( renderer ) );

// Objeto na cena para controlar a posicao da camera
var cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

// Loaders
const loader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

// Creating Scene and calling the main loop
createScene();
animate();

//=================================================================================================
//  FUNCOES
//=================================================================================================

function animate()
{
	renderer.setAnimationLoop(render);
}

function render()
{
	renderer.render(scene, camera);
}

// Inicializa a cena
function createScene()
{
	// Luzes
	const light = new THREE.PointLight(0xffffff, 1);
	light.position.set(2, 4, 0);
	light.castShadow = true;
	light.shadow.mapSize.set(4096, 4096);
	scene.add(light);
	scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
//	scene.add(new THREE.AmbientLight(0x888888));

	// Texturas
	var floorTex = loader.load("assets/panel.png");
	var cubeTex  = loader.load("assets/cube.png");

	// Materiais
	const floorMat = [
		new THREE.MeshStandardMaterial({ map: floorTex, side: THREE.DoubleSide }),
		new THREE.MeshStandardMaterial({ map: floorTex, side: THREE.DoubleSide }),
		new THREE.MeshStandardMaterial({ map: floorTex, side: THREE.DoubleSide }),
		new THREE.MeshStandardMaterial({ map: floorTex, side: THREE.DoubleSide }),
		new THREE.MeshStandardMaterial({ map: floorTex, side: THREE.DoubleSide }),
		new THREE.MeshStandardMaterial({ map: floorTex, side: THREE.DoubleSide })
	];
	const cubeMat = [
		new THREE.MeshStandardMaterial({ map: cubeTex, side: THREE.DoubleSide }),
		new THREE.MeshStandardMaterial({ map: cubeTex, side: THREE.DoubleSide }),
		new THREE.MeshStandardMaterial({ map: cubeTex, side: THREE.DoubleSide }),
		new THREE.MeshStandardMaterial({ map: cubeTex, side: THREE.DoubleSide }),
		new THREE.MeshStandardMaterial({ map: cubeTex, side: THREE.DoubleSide }),
		new THREE.MeshStandardMaterial({ map: cubeTex, side: THREE.DoubleSide })
	];
	const skyMat = [
		new THREE.MeshBasicMaterial({ map: loader.load("assets/sh_ft.png"), side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: loader.load("assets/sh_bk.png"), side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: loader.load("assets/sh_up.png"), side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: loader.load("assets/sh_dn.png"), side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: loader.load("assets/sh_rt.png"), side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: loader.load("assets/sh_lf.png"), side: THREE.BackSide })
	];

	// Objetos basicos
	var floor  = new THREE.Mesh(new THREE.BoxGeometry( 4,  4,  4), floorMat);
	var cube   = new THREE.Mesh(new THREE.BoxGeometry( 1,  1,  1), cubeMat);
	var skybox = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), skyMat);
	floor.position.set(0, -2, 0);
	cube.position.set(1, 0.5, -1);
	cube.rotation.set(0, 1, 0);
	group.add(floor);
	group.add(cube);
	scene.add(skybox);

	// Objeto externo
	var turret = new THREE.Group();
	gltfLoader.load("assets/turret/scene.gltf", function (gltf)
	{
		gltf.scene.scale.setScalar(0.02);
		gltf.scene.traverse(function (child)
		{
			if (child.isMesh)
			{
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		turret.add(gltf.scene);
	});
	turret.position.set(-1, 0, -1.3);
	turret.rotation.set(0, 1, 0);
	scene.add(turret);

	// Faz com que tudo na cena projete e receba sombras
	var themKids = group.children;
	var n = themKids.length;
	for (var i = 0; i < n; i++)
	{
		themKids[i].castShadow = true;
		themKids[i].receiveShadow = true;
	}
	scene.add(group);
}
