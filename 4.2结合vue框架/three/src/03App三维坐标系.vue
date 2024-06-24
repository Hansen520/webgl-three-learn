<!--
 * @Date: 2024-06-20 17:21:11
 * @Description: description
-->
<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.y = 5;
camera.position.z = 10;

// 创建立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: '#42b983' });

// 网格
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 3, 0);
scene.add(cube);

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

// 对轨道控制器改变得时候进行监听
controls.addEventListener('change', () => {
	console.log('触发change');
})

// 添加阻尼
controls.enableDamping = true;
controls.dampingFactor = 0.01;

// 自动旋转
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// 添加坐标轴
const axesHelper = new THREE.AxesHelper(5);
axesHelper.position.y = 1
scene.add(axesHelper);


// 监听窗口大小改变
// window.addEventListener('resize', () => {
// 	// 更新摄像头
// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	// 更新摄像机的投影矩阵
// 	camera.updateProjectionMatrix();
// 	// 更新渲染器
// 	renderer.setSize(window.innerWidth, window.innerHeight);
// 	// 设置渲染器的像素比
// 	renderer.setPixelRatio(window.devicePixelRatio);
// });

// 渲染场景
// renderer.render(scene, camera);

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
  <div>
  </div>
</template>

<style scoped>
</style>
