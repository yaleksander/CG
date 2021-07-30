//=================================================================================================
//  AMBIENTE 02: LABELLING
//-------------------------------------------------------------------------------------------------
//  Aleksander Yacovenco
//  Mestrado em Computação Gráfica UFJF
//  Realidade Virtual e Aumentada 2021/2
//  Prof. Rodrigo Luis
//-------------------------------------------------------------------------------------------------
//  Este codigo usa o "../src/webxr_VR_Drag.js" como base, exceto a funcao "createScene", que foi
//  modificada completamente. Quaisquer outras modificacoes sao registradas com comentarios
//=================================================================================================

//=================================================================================================
//  DECLARACOES E VALORES GLOBAIS
//=================================================================================================

//-------------------------------------------------------------------------------------------------
//  Trecho intocado
//-------------------------------------------------------------------------------------------------

// Imports
import * as THREE from '../build/three.module.js';
import { VRButton } from '../build/jsm/webxr/VRButton.js';
import { onWindowResize } from "../libs/util/util.js";

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
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 30 );

// Create VR button and settings
document.body.appendChild( VRButton.createButton( renderer ) );

//-------------------------------------------------------------------------------------------------
//  Objeto na cena para controlar a posicao da camera
//-------------------------------------------------------------------------------------------------

var cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

//-------------------------------------------------------------------------------------------------
//  "onSelectEnd" inutilizado
//-------------------------------------------------------------------------------------------------

// controllers
let controller1 = renderer.xr.getController( 0 );
controller1.addEventListener( 'selectstart', onSelectStart );
//controller1.addEventListener( 'selectend', onSelectEnd );
cameraHolder.add( controller1 );

//-------------------------------------------------------------------------------------------------
//  Trecho intocado
//-------------------------------------------------------------------------------------------------

// VR Camera Rectile
var ringGeo = new THREE.RingGeometry( .015, .030, 32 );
var ringMat = new THREE.MeshBasicMaterial( {
	color:"rgb(255,255,0)", 
	opacity: 0.9, 
	transparent: true } );
var rectile = new THREE.Mesh( ringGeo, ringMat );
 	rectile.position.set(0, 0, -0.25);
controller1.add( rectile );

//-------------------------------------------------------------------------------------------------
//  Novos valores
//-------------------------------------------------------------------------------------------------

// Nome dos produtos para identificar na funcao e mostrar na interface
const productName =
[
	"Head & Shoulders",
	"Sucrilhos",
	"Merde d\'Artiste"
];

// Descricao dos produtos para mostrar na interface
const productDescription =
[
	"Donti revi caspa!\nFeat. Joel Santana",
	"Radical!",
	"Literalmente.\nPor Piero Manzoni"
];

// Preco dos produtos para mostrar na interface
const productPrice =
[
	"R$20,00",
	"R$10,00",
	"R$200,00"
];

// Variavel que indica qual produto foi selecionado por ultimo
var selected = -1;

// Fonte
const fontLoader = new THREE.FontLoader();
var fontGeometry = null;
const defaultText = "Selecione um produto";
showText(defaultText);

//-------------------------------------------------------------------------------------------------
//  Trecho intocado
//-------------------------------------------------------------------------------------------------

// Creating Scene and calling the main loop
createScene();
animate();

//=================================================================================================
//  FUNCOES
//=================================================================================================

//-------------------------------------------------------------------------------------------------
//  Trecho modificado
//-------------------------------------------------------------------------------------------------

// Atualiza interface quando o usuario seleciona um objeto
function onSelectStart(event)
{
	const controller = event.target;
	const intersections = getIntersections(controller);

	selected = -1;

	if (intersections.length > 0)
	{
		const object = intersections[0].object;

		console.log(object);

		for (var i = 0; i < 3; i++)
			if (object.name == productName[i])
				break;

		var s = productName[i];
		s += '\n';
		s += productDescription[i];
		s += '\n';
		s += productPrice[i];
		showText(s);
		selected = i;
	}
	else
		showText(defaultText);
}

//-------------------------------------------------------------------------------------------------
//  Trecho retirado de "../src/webxr_VR_Labelling" e modificado
//-------------------------------------------------------------------------------------------------

function showText(text)
{
	if (fontGeometry)
		scene.remove(fontGeometry);

	fontLoader.load("../assets/fonts/helvetiker_regular.typeface.json", function (font)
	{
		const matLite = new THREE.MeshBasicMaterial({ color: "rgb(200, 80, 0)" });
		const shapes = font.generateShapes(text, 0.1);

		const geometry = new THREE.ShapeGeometry(shapes);
		geometry.computeBoundingBox();
		const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
		geometry.translate(xMid, 2, 0);

		fontGeometry = new THREE.Mesh(geometry, matLite);
		fontGeometry.position.set(0, 0.55, -1.49);
		fontGeometry.scale.setScalar(0.65);
		scene.add(fontGeometry);
	});	
}

//-------------------------------------------------------------------------------------------------
//  Trecho intocado
//-------------------------------------------------------------------------------------------------

function getIntersections( controller ) {
	const tempMatrix = new THREE.Matrix4();	
	tempMatrix.identity().extractRotation( controller.matrixWorld );
	raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
	raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );
	return raycaster.intersectObjects( group.children );
}

//-------------------------------------------------------------------------------------------------
//  Trecho modificado
//-------------------------------------------------------------------------------------------------

function intersectObjects(controller)
{
	const intersections = getIntersections(controller);

	if (intersections.length > 0)
	{
		const intersection = intersections[0];
		const object = intersection.object;
		intersected.push(object);
	} 
}

function cleanIntersected()
{
	while (intersected.length)
		intersected.pop();
}

function animate()
{
	renderer.setAnimationLoop(render);
}

function render()
{
	cleanIntersected();
	intersectObjects(controller1);
	renderer.render(scene, camera);
}

// Nova funcao para inicializar a cena
function createScene()
{
	// Luzes
	const ambientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(2, 6, 3);
	light.castShadow = true;
	light.shadow.mapSize.set( 4096, 4096 );
	scene.add(light);
	scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

	// Chao
	const floorGeometry = new THREE.PlaneGeometry( 10, 10 );
	const floorMaterial = new THREE.MeshStandardMaterial({
		color: 0x55cc55,
		roughness: 1.0,
		metalness: 0.0
	});
	const floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -Math.PI / 2;
	floor.receiveShadow = true;
	scene.add(floor);

	// Prateleira
	var shelf = new THREE.Group();
	const shelfMat = new THREE.MeshStandardMaterial({
		color: 0xeeeeee,
		roughness: 0.8,
		metalness: 0.2
	});
	const shelfSideGeo   = new THREE.BoxGeometry(0.5, 2, 2);
	const shelfTopGeo    = new THREE.BoxGeometry(6,   2, 2);
	const shelfBottomGeo = new THREE.BoxGeometry(6,   2, 4);
	const shelfBackGeo   = new THREE.BoxGeometry(6,   1, 8);
	var shelfSide1  = new THREE.Mesh(shelfSideGeo,   shelfMat);
	var shelfSide2  = new THREE.Mesh(shelfSideGeo,   shelfMat);
	var shelfTop    = new THREE.Mesh(shelfTopGeo,    shelfMat);
	var shelfBottom = new THREE.Mesh(shelfBottomGeo, shelfMat);
	var shelfBack   = new THREE.Mesh(shelfBackGeo,   shelfMat);
	shelfSide1.position.set (-2.75,  0,    0);
	shelfSide2.position.set ( 2.75,  0,    0);
	shelfTop.position.set   ( 0,     0,    2);
	shelfBottom.position.set( 0,     0,   -3);
	shelfBack.position.set  ( 0,    -1.5, -1);
	shelf.add(shelfSide1);
	shelf.add(shelfSide2);
	shelf.add(shelfTop);
	shelf.add(shelfBottom);
	shelf.add(shelfBack);
	shelf.position.set(0, 1.25, -1.75);
	shelf.rotation.set(Math.PI / 2, Math.PI, 0);
	shelf.scale.setScalar(0.25);

	// Geometrias
	const p1Geo = new THREE.BoxGeometry(0.35, 0.20, 0.10);
	const p2Geo = new THREE.BoxGeometry(0.20, 0.40, 0.08);
	const p3Geo = new THREE.CylinderGeometry(0.08, 0.08, 0.20, 16, 1, true);
	const lGeo  = new THREE.CircleGeometry(0.08, 16);

	// Texture loader
	const loader = new THREE.TextureLoader();

	// Materiais
	const p1Mat = [
		new THREE.MeshBasicMaterial({ color: 0x0055ff }),
		new THREE.MeshBasicMaterial({ color: 0x0055ff }),
		new THREE.MeshBasicMaterial({ color: 0x0055ff }),
		new THREE.MeshBasicMaterial({ color: 0x0055ff }),
		new THREE.MeshBasicMaterial({ map: loader.load("assets/headshoulders.png") }),
		new THREE.MeshBasicMaterial({ color: 0x0055ff })
	];
	const p2Mat = [
		new THREE.MeshBasicMaterial({ color: 0x0022ff }),
		new THREE.MeshBasicMaterial({ color: 0x0022ff }),
		new THREE.MeshBasicMaterial({ color: 0x0022ff }),
		new THREE.MeshBasicMaterial({ color: 0x0022ff }),
		new THREE.MeshBasicMaterial({ map: loader.load("assets/sucrilhos.png") }),
		new THREE.MeshBasicMaterial({ color: 0x0022ff })
	];
	const p3Mat = new THREE.MeshBasicMaterial({ map: loader.load("assets/merde.png") });
	const lMat  = new THREE.MeshStandardMaterial({
		color: 0x888888,
		roughness: 0.2,
		metalness: 0.9
	});

	// Head & Shoulders
	var p11 = new THREE.Mesh(p1Geo, p1Mat);
	var p12 = new THREE.Mesh(p1Geo, p1Mat);
	p11.position.set(-0.40, 1.10, -1.85);
	p12.position.set(-0.40, 1.10, -1.65);
	p11.name = productName[0];
	p12.name = productName[0];
	group.add(p11);
	group.add(p12);

	// Sucrilhos
	var p21 = new THREE.Mesh(p2Geo, p2Mat);
	var p22 = new THREE.Mesh(p2Geo, p2Mat);
	p21.position.set(0, 1.20, -1.85);
	p22.position.set(0, 1.20, -1.65);
	p21.name = productName[1];
	p22.name = productName[1];
	group.add(p21);
	group.add(p22);

	// Merda
	var p31 = new THREE.Mesh(p3Geo, p3Mat);
	var p32 = new THREE.Mesh(p3Geo, p3Mat);
	var p33 = new THREE.Mesh(p3Geo, p3Mat);
	p31.position.set(0.50, 1.10, -1.65);
	p32.position.set(0.35, 1.10, -1.75);
	p33.position.set(0.42, 1.30, -1.70);
	p31.rotation.set(0, 2, 0);
	p32.rotation.set(0, 4, 0);
	p33.rotation.set(0, 3, 0);
	p31.name = productName[2];
	p32.name = productName[2];
	p33.name = productName[2];
	group.add(p31);
	group.add(p32);
	group.add(p33);

	// Tampa da merda
	var l1 = new THREE.Mesh(lGeo, lMat);
	var l2 = new THREE.Mesh(lGeo, lMat);
	var l3 = new THREE.Mesh(lGeo, lMat);
	var l4 = new THREE.Mesh(lGeo, lMat);
	l1.position.set(0.50, 1.20, -1.65);
	l2.position.set(0.35, 1.20, -1.75);
	l3.position.set(0.42, 1.20, -1.70);
	l4.position.set(0.42, 1.40, -1.70);
	l1.rotation.set(-Math.PI / 2, 0, 0);
	l2.rotation.set(-Math.PI / 2, 0, 0);
	l3.rotation.set(-Math.PI / 2, 0, 0);
	l4.rotation.set(-Math.PI / 2, 0, 0);
	l1.name = productName[2];
	l2.name = productName[2];
	l3.name = productName[2];
	l4.name = productName[2];
	group.add(l1);
	group.add(l2);
	group.add(l3);
	group.add(l4);

	// Faz com que tudo na cena projete e receba sombras
	var themKids = shelf.children.concat(group.children);
	var n = themKids.length;
	for (var i = 0; i < n; i++)
	{
		themKids[i].castShadow = true;
		themKids[i].receiveShadow = true;
	}
	scene.add(group);
	scene.add(shelf);
}
