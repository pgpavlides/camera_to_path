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
obj.scale.set(1, 1, 1);
scene.add(obj);

let curve = new THREE.EllipseCurve(0, 0, 5, 5);

let line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(100)), new THREE.LineBasicMaterial({
  color: "yellow"
}));
line.rotation.x = Math.PI / 2

line.position.x = 0;
line.position.z = 0;
scene.add(line);

let cam = new THREE.PerspectiveCamera(25, 1, 1.5, 25);
let camHelper = new THREE.CameraHelper(cam);
scene.add(camHelper);

let clock = new THREE.Clock();
let v = new THREE.Vector3();
let wpSize = Math.min(innerWidth, innerHeight) / 4;

renderer.setAnimationLoop(() => {

  let t = (clock.getElapsedTime() * 0.05) % 1;

  curve.getPointAt(t, v);
  cam.position.copy(v);
  cam.position.applyMatrix4(line.matrixWorld);
  
  // Calculate the vector from the camera position to the center of the circle
  let dirToCenter = new THREE.Vector3(0, 0, 0).sub(cam.position).normalize();
  
  // Calculate the point in space that the camera should look at, which is a position
  // along the line from the camera position to the center of the circle but extended outward.
  let lookAtPoint = cam.position.clone().add(dirToCenter.multiplyScalar(-10)); // you can adjust the scalar value to your needs
  
  cam.lookAt(lookAtPoint);

  renderer.clear();
  camHelper.visible = true;
  renderer.setViewport(0, 0, innerWidth, innerHeight);
  renderer.render(scene, camera);
  camHelper.visible = false;
  renderer.setViewport(0, innerHeight - wpSize, wpSize, wpSize);
  renderer.render(scene, cam);
})
