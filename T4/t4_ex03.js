//=================================================================================================
//  AMBIENTE 03: DRAGGING
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

// Loaders
const loader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

// Relogio para frames de animacao
var clock = new THREE.Clock();

// Animacoes
var mixer;

// controllers
let controller1 = renderer.xr.getController( 0 );
controller1.addEventListener( 'selectstart', onSelectStart );
controller1.addEventListener( 'selectend', onSelectEnd );
cameraHolder.add( controller1 );

// VR Camera Rectile
var ringGeo = new THREE.RingGeometry( .01, .02, 32 );
var ringMat = new THREE.MeshBasicMaterial( {
	color:"rgb(255,255,0)", 
	opacity: 0.9, 
	transparent: true } );
var rectile = new THREE.Mesh( ringGeo, ringMat );
 	rectile.position.set(0, 0, -0.25);
controller1.add( rectile );

// Valores controlados
var vAxis, hAxis, vSlider, hSlider, turret, pedestal;

// Creating Scene and calling the main loop
createScene();
animate();

//=================================================================================================
//  FUNCOES
//=================================================================================================

function onSelectStart( event ) {
	const controller = event.target;
	const intersections = getIntersections( controller );

	if ( intersections.length > 0 ) {
		const intersection = intersections[ 0 ];
		const object = intersection.object;
		if (object == vAxis || object == hAxis)
			return;
		object.material.emissive.b = 1;
//		controller.attach( object );
		controller.userData.selected = object;
	}
}

function onSelectEnd( event ) {
	const controller = event.target;
	if ( controller.userData.selected !== undefined ) {
		const object = controller.userData.selected;
		object.material.emissive.b = 0;
//		group.attach( object );
		controller.userData.selected = undefined;
	}
}

function getIntersections( controller ) {
	const tempMatrix = new THREE.Matrix4();	
	tempMatrix.identity().extractRotation( controller.matrixWorld );
	raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
	raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );
	return raycaster.intersectObjects( group.children );
}

function intersectObjects(controller)
{
	const intersections = getIntersections(controller);

	if (intersections.length > 0)
	{
		var vAxisSelected = false;
		var hAxisSelected = false;
		for (var i = 0; i < intersections.length; i++)
		{
			if (intersections[i].object == vAxis)
			{
				vAxisSelected = true;
				break;
			}
			if (intersections[i].object == hAxis)
			{
				hAxisSelected = true;
				break;
			}
		}
		const object = intersections[0].object;
		if (controller.userData.selected === vSlider && vAxisSelected)
			moveOnVAxis(intersections[0].point.y);
		if (controller.userData.selected === hSlider && hAxisSelected)
			moveOnHAxis(intersections[0].point.x);
		if (object === vSlider || object === hSlider)
			object.material.emissive.r = 1;
		intersected.push( object );
	} 
}

function cleanIntersected()
{
	while (intersected.length)
	{
		const object = intersected.pop();
		if (object === vSlider || object === hSlider)
			object.material.emissive.r = 0;
	}
}

function animate() {
	renderer.setAnimationLoop( render );
}

function render() {
	cleanIntersected();
	if (mixer)
		mixer.update(clock.getDelta());
	intersectObjects( controller1 );
	renderer.render( scene, camera );
}

function moveOnVAxis(delta)
{
	vSlider.position.set(-2, delta, -4);
	turret.scale.setScalar((delta + 0.5));
	turret.position.set(0, delta * 0.63 - 0.7, -7);
	pedestal.scale.setScalar(delta + 0.5);
	pedestal.position.set(0, delta * 0.5 - 0.75, -7);
}

function moveOnHAxis(delta)
{
	hSlider.position.set(delta, 0, -4);
	turret.rotation.y = (delta + 1.5) * 2 * Math.PI / 3;
}

// Nova funcao para inicializar a cena
function createScene()
{
	// Luzes
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(2, 6, 3);
	light.castShadow = true;
	light.shadow.mapSize.set( 4096, 4096 );
	scene.add(light);
	scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

	// Chao
	const floor = new THREE.Mesh(new THREE.CircleGeometry(10, 32), new THREE.MeshStandardMaterial({ color: 0x0044ee }));
	floor.rotation.x = Math.PI / 2;
	floor.receiveShadow = true;
	scene.add(floor);

	// Pedestal
	pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.25, 32), new THREE.MeshStandardMaterial({ color: 0x444444 }));
	pedestal.castShadow = true;
	pedestal.receiveShadow = true;
	scene.add(pedestal);

	// Objeto externo
	turret = new THREE.Group();
	gltfLoader.load("assets/turret/scene.gltf", function (gltf)
	{
		gltf.scene.scale.setScalar(0.0002);
		mixer = new THREE.AnimationMixer(gltf.scene);
		var idle = mixer.clipAction(gltf.animations[9])
		idle.play();
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
	scene.add(turret);

	// Objetos controlaveis
	const sliderGeo = new THREE.SphereGeometry(0.2, 32, 32);
	const sliderMat1 = new THREE.MeshStandardMaterial({ color: 0x8822ee });
	const sliderMat2 = new THREE.MeshStandardMaterial({ color: 0x8822ee });
	const axisGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);
	const axisMat = new THREE.MeshBasicMaterial({ color: 0xff4400 });
	vAxis = new THREE.Mesh(axisGeo, axisMat);
	hAxis = new THREE.Mesh(axisGeo, axisMat);
	hAxis.rotation.set(0, 0, Math.PI / 2);
	vSlider = new THREE.Mesh(sliderGeo, sliderMat1);
	hSlider = new THREE.Mesh(sliderGeo, sliderMat2);
	vAxis.position.set(-2, 2, -4);
	hAxis.position.set( 0, 0, -4);
	vSlider.position.set(-2,   0.5, -4);
	hSlider.position.set(-1.5, 0,   -4);
	moveOnVAxis(0.5);
	group.add(vAxis);
	group.add(hAxis);
	group.add(vSlider);
	group.add(hSlider);
	scene.add(group);
}
