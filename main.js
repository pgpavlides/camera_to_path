import './style.css'

import * as THREE from "three";
import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(-10, 10, 10);
let renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
})

let controls = new OrbitControls(camera, renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.setScalar(1);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

let grid = new THREE.GridHelper();
grid.position.y = -5;
scene.add(grid);

let obj = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshLambertMaterial({
  color: "aqua"
}));
obj.scale.set(2, 3, 1);
scene.add(obj);

let curve = new THREE.EllipseCurve(0, 0, 10, 5);

let line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(100)), new THREE.LineBasicMaterial({
  color: "yellow"
}));
line.rotation.x = -Math.PI * 0.25;
line.rotation.z = Math.PI * 0.125;
line.position.x = 5;
line.position.z = -2;
scene.add(line);

let cam = new THREE.PerspectiveCamera(25, 1, 1.5, 25);
let camHelper = new THREE.CameraHelper(cam);
scene.add(camHelper);

let clock = new THREE.Clock();
let v = new THREE.Vector3();
let wpSize = Math.min(innerWidth, innerHeight) / 4;

renderer.setAnimationLoop(() => {

  let t = (clock.getElapsedTime() * 0.05) % 1;
  
  curve.getPointAt(t, v)
  cam.position.copy(v);
  cam.position.applyMatrix4(line.matrixWorld);
  cam.lookAt(obj.position);

  renderer.clear();
  camHelper.visible = true;
  renderer.setViewport(0, 0, innerWidth, innerHeight);
  renderer.render(scene, camera);
  camHelper.visible = false;
  renderer.setViewport(0, innerHeight - wpSize, wpSize, wpSize);
  renderer.render(scene, cam);
})
