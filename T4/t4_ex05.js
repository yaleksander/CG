//=================================================================================================
//  AMBIENTE 04: TELEPORT
//-------------------------------------------------------------------------------------------------
//  Aleksander Yacovenco
//  Mestrado em Computação Gráfica UFJF
//  Realidade Virtual e Aumentada 2021/2
//  Prof. Rodrigo Luis
//-------------------------------------------------------------------------------------------------
//  Este codigo usa "t4_ex04.js" e "../src/webxr_VR_FreeMove.js" como base
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
var group = new THREE.Group();         // Objects of the scene will be added in this group
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
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 30 );

// Create VR button and settings
document.body.appendChild( VRButton.createButton( renderer ) );

// Objeto na cena para controlar a posicao da camera
var cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

// controllers
let controller1 = renderer.xr.getController( 0 );
controller1.addEventListener( 'selectstart', onSelectStart );
controller1.addEventListener( 'selectend', onSelectEnd );
cameraHolder.add( controller1 );

// Loaders
const loader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

// Altura da camera
var defaultHeight = 0;

// Constola se o usuario esta se movendo ou nao
var moveCamera = false;

// Creating Scene and calling the main loop
createScene();
animate();

//=================================================================================================
//  FUNCOES
//=================================================================================================

function move()
{
	if (moveCamera)
	{
		// Get Camera Rotation
		let quaternion = new THREE.Quaternion();
		quaternion = camera.quaternion;

		// Get direction to translate from quaternion
		var moveTo = new THREE.Vector3(0, 0, -0.05);
		moveTo.applyQuaternion(quaternion);

		var x = moveTo.x + cameraHolder.position.x;
		var z = moveTo.z + cameraHolder.position.z;

		// Bloqueios
		if (x < -2 && z < -4 && z > -6)
			return;
		if (x > 2 && z < -4 && z > -6)
			return;
		if (x < -4 || x > 4 || z < -14 || z > 4)
			return;

		// Move the camera Holder to the computed direction
		cameraHolder.translateX(moveTo.x);
//		cameraHolder.translateY(moveTo.y);
		cameraHolder.translateZ(moveTo.z);	
	}
}

function onSelectStart( ) 
{
	moveCamera = true;
}

function onSelectEnd( ) 
{
	moveCamera = false;
}

function animate()
{
	renderer.setAnimationLoop( render );
}

function render()
{
	move();
	renderer.render(scene, camera);
}

// Nova funcao para inicializar a cena
function createScene()
{
	// Luzes
	scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
	const light1 = new THREE.PointLight(0xffddff, 1, 100);
	const light2 = new THREE.PointLight(0xffddff, 1, 100);
	const light3 = new THREE.PointLight(0xffddff, 1, 100);
	light1.position.set(0, 6, -10);
	light2.position.set(0, 6,   4);
	light3.position.set(0, 6, -14);
	scene.add(light1);
	scene.add(light2);
	scene.add(light3);

	// Objetos externos
	var anduril = new THREE.Group();
	gltfLoader.load("assets/anduril/scene.gltf", function (gltf) { anduril.add(gltf.scene); });
	anduril.scale.setScalar(0.02);
	anduril.rotation.set(Math.PI / 2, 0, Math.PI / 2);
	anduril.position.set(4, 2, -8.5);
	scene.add(anduril);
	var longsword = new THREE.Group();
	gltfLoader.load("assets/longsword/scene.gltf", function (gltf) { longsword.add(gltf.scene); });
	longsword.scale.setScalar(1.1);
	longsword.rotation.set(Math.PI / 2, 0, Math.PI / 2);
	longsword.position.set(4, 2, -11.5);
	scene.add(longsword);
	var master_sword = new THREE.Group();
	gltfLoader.load("assets/master_sword/scene.gltf", function (gltf) { master_sword.add(gltf.scene); });
	master_sword.scale.setScalar(1.2);
	master_sword.position.set(-4, 1.5, -8.5);
	master_sword.rotation.set(0, Math.PI / 2, 0);
	scene.add(master_sword);
	var zweihander = new THREE.Group();
	gltfLoader.load("assets/zweihander/scene.gltf", function (gltf) { zweihander.add(gltf.scene); });
	zweihander.scale.setScalar(0.18);
	zweihander.rotation.set(Math.PI, Math.PI / 2, 0);
	zweihander.position.set(-1.5, 3.35, -14);
	scene.add(zweihander);
	var zweihander_ds = new THREE.Group();
	gltfLoader.load("assets/zweihander_ds/scene.gltf", function (gltf) { zweihander_ds.add(gltf.scene); });
	zweihander_ds.scale.setScalar(0.016);
	zweihander_ds.rotation.set(Math.PI, 0, 0);
	zweihander_ds.position.set(1.5, 4, -14);
	scene.add(zweihander_ds);
	var rapier = new THREE.Group();
	gltfLoader.load("assets/rapier/scene.gltf", function (gltf) { rapier.add(gltf.scene); });
	rapier.scale.setScalar(0.01);
	rapier.rotation.set(Math.PI, 0, 0);
	rapier.position.set(-4, 2.5, -11.5);
	scene.add(rapier);
	var chandelier1 = new THREE.Group();
	gltfLoader.load("assets/chandelier/scene.gltf", function (gltf) { chandelier1.add(gltf.scene); });
	chandelier1.scale.setScalar(2.1);
	chandelier1.position.set(0, 6, 0);
	scene.add(chandelier1);
	var chandelier2 = new THREE.Group();
	gltfLoader.load("assets/chandelier/scene.gltf", function (gltf) { chandelier2.add(gltf.scene); });
	chandelier2.scale.setScalar(2.1);
	chandelier2.position.set(0, 6, -10);
	scene.add(chandelier2);
	var greek = new THREE.Group();
	gltfLoader.load("assets/greek/scene.gltf", function (gltf)
	{
		greek.add(gltf.scene);
		gltf.scene.traverse(function (child)
		{
			if (child.isMesh)
				child.castShadow = true;
		});
	});
	greek.position.set(0, 1.25, 0);
	greek.rotation.set(0, Math.PI, 0);
	scene.add(greek);
	var horse = new THREE.Group();
	gltfLoader.load("assets/horse/scene.gltf", function (gltf)
	{
		horse.add(gltf.scene);
		gltf.scene.traverse(function (child)
		{
			if (child.isMesh)
				child.castShadow = true;
			child.traverse(function (child2)
			{
				// Nem assim...
				if (child2.isMesh)
					child2.castShadow = true;
			});
		});
	});
	horse.scale.setScalar(2.5);
	horse.position.set(-0.4, 1.2, -10);
	horse.rotation.set(0, Math.PI / 2, 0);
	scene.add(horse);

	// Quadros
	var quadros = new THREE.Group();
	const bordaMat = new THREE.MeshBasicMaterial({ color: 0xd49c35 });
	const bordaPequena = new THREE.BoxGeometry(1.0, 0.2, 0.2);
	const bordaMedia   = new THREE.BoxGeometry(1.5, 0.2, 0.2);
	const bordaGrande  = new THREE.BoxGeometry(2.0, 0.2, 0.2);
	const ivanMat       = new THREE.MeshStandardMaterial({ map: loader.load("assets/ivan.png"),       side: THREE.DoubleSide });
	const luciferMat    = new THREE.MeshStandardMaterial({ map: loader.load("assets/lucifer.png"),    side: THREE.DoubleSide });
	const nightMat      = new THREE.MeshStandardMaterial({ map: loader.load("assets/night.png"),      side: THREE.DoubleSide });
	const revolutionMat = new THREE.MeshStandardMaterial({ map: loader.load("assets/revolution.png"), side: THREE.DoubleSide });
	const tigerMat      = new THREE.MeshStandardMaterial({ map: loader.load("assets/tiger.png"),      side: THREE.DoubleSide });
	const timeMat       = new THREE.MeshStandardMaterial({ map: loader.load("assets/time.png"),       side: THREE.DoubleSide });
	var ivan       = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.8), ivanMat);
	var lucifer    = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.8), luciferMat);
	var night      = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.8), nightMat);
	var revolution = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.8), revolutionMat);
	var tiger      = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.3), tigerMat);
	var time       = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.8), timeMat);
	ivan.rotation.set(   0, Math.PI / 2, 0);
	lucifer.rotation.set(0, Math.PI / 2, 0);
	tiger.rotation.set(  0, Math.PI / 2, 0);
	time.rotation.set(   0, Math.PI / 2, 0);
	ivan.position.set(      -3.99, 3, -1.50);
	lucifer.position.set(   -3.99, 3,  1.50);
	night.position.set(     -1.50, 3,  3.99);
	revolution.position.set( 1.50, 3,  3.99);
	tiger.position.set(      3.99, 3,  1.50);
	time.position.set(       3.99, 3, -1.50);
	quadros.add(ivan);
	quadros.add(lucifer);
	quadros.add(night);
	quadros.add(revolution);
	quadros.add(tiger);
	quadros.add(time);
	// Sem bordas, infelizmente
	scene.add(quadros);

	//=================================================================================================
	//  Calculo de intersecoes e areas passaveis
	//-------------------------------------------------------------------------------------------------
	//  A ideia aqui era criar planos extras invisiveis para o usuario. Esses planos essencialmente
	//  indicariam as areas passaveis, e apenas quando o cursor apontasse pra essas areas escondidas
	//  o usuario poderia se mover naquela direcao. Pela falta de tempo, optei por fazer a intersecao
	//  do cursor com o chao representar uma area passavel e a do cursor com as paredes uma area nao
	//  passavel. Tambem ha paredes escondidas abaixo das estatuas no centro das salas
	//=================================================================================================

	const floorTex = loader.load("assets/wood.png");
	floorTex.wrapS = THREE.RepeatWrapping;
	floorTex.wrapT = THREE.RepeatWrapping;
	floorTex.repeat.set(4, 8);
	const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, side: THREE.DoubleSide });
	const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMat);
	floor.rotation.set(Math.PI / 2, 0, 0);
	floor.position.set(0, 0, -5);
	floor.name = "pass";
	group.add(floor);

	const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x223388, side: THREE.DoubleSide, metalness: 0.9 });
	const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), ceilingMat);
	ceiling.rotation.set(Math.PI / 2, 0, 0);
	ceiling.position.set(0, 8, -5);
	group.add(ceiling);

	const wallMat   = new THREE.MeshStandardMaterial({ color: 0x2266dd, side: THREE.DoubleSide });
	const bigWall   = new THREE.PlaneGeometry(8, 8);
	const smallWall = new THREE.PlaneGeometry(2, 8);
	const wall01 = new THREE.Mesh(bigWall,   wallMat);
	const wall02 = new THREE.Mesh(bigWall,   wallMat);
	const wall03 = new THREE.Mesh(smallWall, wallMat);
	const wall04 = new THREE.Mesh(smallWall, wallMat);
	const wall05 = new THREE.Mesh(smallWall, wallMat);
	const wall06 = new THREE.Mesh(bigWall,   wallMat);
	const wall07 = new THREE.Mesh(bigWall,   wallMat);
	const wall08 = new THREE.Mesh(smallWall, wallMat);
	const wall09 = new THREE.Mesh(smallWall, wallMat);
	const wall10 = new THREE.Mesh(smallWall, wallMat);
	const wall11 = new THREE.Mesh(bigWall,   wallMat);
	const wall12 = new THREE.Mesh(bigWall,   wallMat);
	wall01.position.set(-4, 4, -10);
	wall02.position.set(-4, 4,   0);
	wall03.position.set(-3, 4,  -6);
	wall04.position.set(-3, 4,  -4);
	wall05.position.set(-2, 4,  -5);
	wall06.position.set( 0, 4, -14);
	wall07.position.set( 0, 4,   4);
	wall08.position.set( 2, 4,  -5);
	wall09.position.set( 3, 4,  -6);
	wall10.position.set( 3, 4,  -4);
	wall11.position.set( 4, 4, -10);
	wall12.position.set( 4, 4,   0);
	wall01.rotation.set(0, Math.PI / 2, 0);
	wall02.rotation.set(0, Math.PI / 2, 0);
	wall05.rotation.set(0, Math.PI / 2, 0);
	wall08.rotation.set(0, Math.PI / 2, 0);
	wall11.rotation.set(0, Math.PI / 2, 0);
	wall12.rotation.set(0, Math.PI / 2, 0);
	group.add(wall01);
	group.add(wall02);
	group.add(wall03);
	group.add(wall04);
	group.add(wall05);
	group.add(wall06);
	group.add(wall07);
	group.add(wall08);
	group.add(wall09);
	group.add(wall10);
	group.add(wall11);
	group.add(wall12);
	for (var i = 0; i < group.children.length; i++)
	{
		group.children[i].castShadow = true;
		group.children[i].receiveShadow = true;
	}

	scene.add(group);
	cameraHolder.position.set(0, defaultHeight, -3.5);
}
