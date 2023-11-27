import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const canvas = document.querySelector("#app canvas");
const sizes = {
  width : window.innerWidth,
  height : window.innerHeight
}

/**
 * THREE JS SCENE
 */
const scene = new THREE.Scene()

/**
 * Camera
*/
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 600
camera.fov = 2 * Math.atan((sizes.height / 2)/600) * (180 / Math.PI);

camera.updateProjectionMatrix()
scene.add(camera)

const cameraHelper = new THREE.CameraHelper(camera)
// scene.add(cameraHelper)

/**
 *  Geometry 
*/
const geometry = new THREE.PlaneGeometry(1, 1, 100, 100)

// Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms : {
    uTexture : { value : new THREE.Vector2(0, 0) }
  }
  // transparent : true
})





const sceneQuad = new THREE.Scene()
const materialQuad = new THREE.MeshBasicMaterial({ 
  transparent : true
})
const aspect = sizes.width / sizes.height
const quadMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  materialQuad
)
quadMesh.scale.set(sizes.width, sizes.height)
sceneQuad.add(quadMesh)


/**
 * Background Quad
*/

const backgroundMeshQuad = new THREE.Mesh(
  // new THREE.PlaneGeometry(sizes.width, sizes.height),
  new THREE.PlaneGeometry(1, 1),
  materialQuad
)
backgroundMeshQuad.scale.set(sizes.width, sizes.height, 1)
backgroundMeshQuad.position.y = 100

/**
 * Meshes and Objects logic
*/

const meshes = []
const numberOfMeshes = 10;

const addObjects = () =>
{
  for (let i = 0; i < numberOfMeshes; i++) {

    let textureLoader = new THREE.TextureLoader()
    let texture = textureLoader.load(`/images/${((i % 5) + 1)}.jpg`)

    let planeMaterial = material.clone()
    planeMaterial.uniforms.uTexture.value = texture

    const mesh = new THREE.Mesh(geometry, planeMaterial)
    mesh.scale.set(400, 400, 1);

    meshes.push(
      {
        mesh,
        index : i
      }
    )
    scene.add(mesh)

  }
}


const sizeofMesh = 400;
const spacingBetweenSlides = 1.1;

const updateMeshes = () =>
{
  const totalWidth = numberOfMeshes * sizeofMesh * spacingBetweenSlides
  const positionFactor = - (sizes.width / 2) + sizeofMesh / 2;

  meshes.forEach(item => {
    item.mesh.position.x =  ((item.index * sizeofMesh *  spacingBetweenSlides + currentScroll * sizeofMesh + sizeofMesh) % totalWidth + totalWidth) % totalWidth + positionFactor - sizeofMesh

  })
}

/**
 *  For scroll events 
*/

let scroll = 0;
let scrollTarget = 0;
let currentScroll = 0;

const scrollEvent = () =>
{
  document.addEventListener('mousewheel', e => {
    scrollTarget = e.wheelDeltaY * 0.5;
  })
}

/**
 * Function calls
*/

addObjects()
updateMeshes()
scrollEvent()

/**
 * Renderer
*/
const renderer = new THREE.WebGLRenderer({
  canvas
})

/** 
 * Orbit Controls
*/
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Tick function
*/

const tick = () =>
{

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  scroll += (scrollTarget - scroll) * 0.05
  scroll *= 0.9;
  scrollTarget *= 0.9;
  currentScroll += scroll * 0.005;
  updateMeshes()
  
  // update orbitol controls
  // controls.update()


  renderer.render(scene, camera)


  window.requestAnimationFrame(tick)
}

tick()

/**
 *  Handle Resize 
*/

const handleResize = () =>
{
  // update the sizes variable
  sizes.width = window.innerWidth,
  sizes.height = window.innerHeight;

  backgroundMeshQuad.scale.set(sizes.width, sizes.height, 1)

  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.fov = Math.atan((sizes.height / 2)/600) * (180 / Math.PI) * 2;
  // update the Three JS Projections matrix
  camera.updateProjectionMatrix()
  // update renderer
  // renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  
}

window.addEventListener('resize', handleResize)
handleResize()


