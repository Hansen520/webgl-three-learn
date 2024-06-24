<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.y = 5;
camera.position.z = 10;


//创建几何体
const geometry = new THREE.BufferGeometry();
// 创建顶点数据
const vertices = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0]);
// 创建顶点属性
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
// 创建索引属性
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

// 设置2个顶点租，形成2个材质
geometry.addGroup(0, 3, 0); // indices(从索引0开始， 数3个，材质为0)
geometry.addGroup(3, 3, 1);

// 创建材质
const material0 = new THREE.MeshBasicMaterial({ color: '#42b983', wireframe: true});
const material1 = new THREE.MeshBasicMaterial({ color: '#ff0000', side: THREE.DoubleSide });
const cube = new THREE.Mesh(geometry, [material0, material1]);
scene.add(cube);

// 创建立方体
const cubegeomrtry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial0 = new THREE.MeshBasicMaterial({ color: '#42b983', wireframe: true});
const cubeMaterial1 = new THREE.MeshBasicMaterial({ color: '#ff0000', side: THREE.DoubleSide });
const cubeMaterial2 = new THREE.MeshBasicMaterial({ color: '#ff00ff', wireframe: true });
const cubeMaterial3 = new THREE.MeshBasicMaterial({ color: '#ffff00' });
const cubeMaterial4 = new THREE.MeshBasicMaterial({ color: '#0000ff' });
const cubeMaterial5 = new THREE.MeshBasicMaterial({ color: '#ffffff' });
// 网格
const cubeMaterial = new THREE.Mesh(cubegeomrtry, [cubeMaterial0, cubeMaterial1, cubeMaterial2, cubeMaterial3, cubeMaterial4, cubeMaterial5]);

console.log(geometry, 38);
cube.position.x = 2;
scene.add(cubeMaterial);

// 添加网格地面
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
 
// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// 将渲染器添加到页面
document.body.appendChild(renderer.domElement);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 添加阻尼
controls.enableDamping = true;
controls.dampingFactor = 0.01;

// 添加坐标轴
const axesHelper = new THREE.AxesHelper(5);
axesHelper.position.y = 1
scene.add(axesHelper);

// 让立方体动起来
function animate() {
    // 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
    requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	controls.update();
    renderer.render( scene, camera );
}
animate();
</script>

<template>
</template>

<style scoped>
</style>
