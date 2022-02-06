import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import LoaderGLTF from './utils/LoaderGLTF';
import ModelsGLTF from './components/ModelsGLTF';
import ProjectionEnvironment from './components/ProjectionEnvironment';

let container, controls;
let camera, scene, renderer, lightH, lightD1;

container = document.createElement('div');
document.body.appendChild(container);


// ----------------------------------------------------------------------------
// camera

camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 0, 0);
camera.position.z = -40;

controls = new OrbitControls(camera);
controls.target.set(0, 0, 0);

controls.minDistance = 1;
controls.maxDistance = 2000;

controls.minPolarAngle = Math.PI / 5.5
controls.maxPolarAngle = Math.PI / 1.9;

controls.enableZoom = true;
controls.enableRotate = true;
controls.enablePan = true;

controls.update();

scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

window.addEventListener('resize', onWindowResize, false);

// --------------------------------------------------------------------------------
// lighting

lightH = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
lightH.name = 'lightH';
lightH.position.set(0, 0, 0);
scene.add(lightH);

lightD1 = new THREE.DirectionalLight(0xffffff, 0.6);
lightD1.name = 'lightD1'
lightD1.position.set(0, 10, 10);
lightD1.castShadow = true;
lightD1.target.position.set(0, -0.5, 0);

const sMapSize = 1024;
lightD1.shadow.mapSize.width = sMapSize;
lightD1.shadow.mapSize.height = sMapSize;
lightD1.shadow.camera.near = 0.2;
lightD1.shadow.camera.far = 500;
lightD1.shadow.camera.updateProjectionMatrix();

scene.add(lightD1);
scene.add(lightD1.target);
lightD1.target.updateMatrixWorld();

// --------------------------------------------------------------------------
// renderer

renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const shadMap = {
  BasicShadowMap: THREE.BasicShadowMap,
  PCFShadowMap: THREE.PCFShadowMap,
  PCFSoftShadowMap: THREE.PCFSoftShadowMap,
  VSMShadowMap: THREE.VSMShadowMap,
}

renderer.physicallyCorrectLights = true;
renderer.shadowMap.type = shadMap.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;

const toneMap = {
  NoToneMapping: THREE.NoToneMapping,
  LinearToneMapping: THREE.LinearToneMapping,
  ReinhardToneMapping: THREE.ReinhardToneMapping,
  CineonToneMapping: THREE.CineonToneMapping,
  ACESFilmicToneMapping: THREE.ACESFilmicToneMapping,
  CustomToneMapping: THREE.LinearToneMapping
}
//
renderer.toneMapping = toneMap.LinearToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

// -----------------------------------------------------------------------------------
// allow three js inspector
window.THREE = THREE;
window.scene = scene;
// -----------------------------------------------------------------------------------
// event

const eventList = [];
let eventListLength = 0;

const addToEventList = function (event) {
  eventList.push(event);
  eventListLength = eventList.length;
};

const update = function () {
  
  for (let n = 0; n < eventListLength; n++) {
    eventList[n]();
  }
  
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// load

const textureLoader = new THREE.TextureLoader();

const projectorParams = {
  
  projectionTexture:[],
  
  projectorModelMaterial:new THREE.MeshPhongMaterial({
    specular: 0x171C1E,
    emissive: 0x000000,
    color: 0x999999,
    shininess:50,
    transparent: false,
  })
  
}

const initProjectionEnvironment = (modelList) => {
  
  // load texture / textures
  textureLoader.load('../lib/projection-textures/projection-texture-512.png', (texture) => {
    
    // currently one only
    projectorParams.projectionTexture.push(texture);
    
    ProjectionEnvironment(controls, modelList, projectorParams, addToEventList);
    
    // init event
    update();
    
  });
}


const initModels = (gltf) => {
  
  ModelsGLTF(gltf, function (modelList) {
    
    initProjectionEnvironment(modelList);
    
  });
}

LoaderGLTF('../lib/gltf/environment.gltf', initModels);

