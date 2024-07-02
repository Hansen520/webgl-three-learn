<template>
  <div id="container"></div>
</template>

<script setup>
// 绘制一个几何体
import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from "three/examples/jsm/objects/Water2";

// 创建场景
// 场景能够让你在什么地方、摆放什么东西来交给three.js来渲染，这是你放置物体、灯光和摄像机的地方。
const scene = new THREE.Scene();
// 添加背景颜色
scene.background = new THREE.Color(0x666666);

// 创建相机
const camera = new THREE.PerspectiveCamera();
camera.position.y = 3;
camera.position.z = 10;

const geometry = new THREE.BufferGeometry();
// 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
// 因为在两个三角面片里，这两个顶点都需要被用到。
const vertices = new Float32Array([
  -1.0, -1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0, 1.0, 1.0,
  // -1.0, -1.0, -1.0,
  //  1.0, 1.0, -1.0,
  // 1.0, -1.0, -1.0,

  // 1.0, 1.0, 1.0,
  -1.0, 1.0, -1.0,
  // -1.0, -1.0, 1.0,
])

// itemSize = 3 因为每个顶点都是一个三元组。
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

// Unit16Array类型数组创建顶点索引数据
const indexes = new Uint16Array([
  // 下面索引值对应顶点位置数据中的顶点坐标
  0, 1, 2, 0, 2, 3, 2, 3, 1
])
geometry.index = new THREE.BufferAttribute(indexes, 1)

console.log(geometry, 'geometry')
const material = new THREE.MeshBasicMaterial({ 
  color: 0xffff00,
  wireframe: true,
  // side: THREE.DoubleSide
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

onMounted(() => {
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 将渲染器添加到页面
  document.getElementById("container").appendChild(renderer.domElement);

  // 添加轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);

  // 让立方体动起来
  function animate() {
    // 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
    requestAnimationFrame(animate);

    // 轨道控制器更新
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});
</script>