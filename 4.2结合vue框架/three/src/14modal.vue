<template>
  <div id="container"></div>
</template>

<script setup>
// 绘制一个几何体
import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 创建场景
// 场景能够让你在什么地方、摆放什么东西来交给three.js来渲染，这是你放置物体、灯光和摄像机的地方。
const scene = new THREE.Scene();
// 添加背景颜色
scene.background = new THREE.Color(0x666666);

// 创建相机
const camera = new THREE.PerspectiveCamera();
camera.position.y = 10;
camera.position.x = 10;
camera.position.z = 10;

// 材质
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff33,
  wireframe: true,
})

// 创建GLTF实例
const loader = new GLTFLoader();

// 加载GLTF模型
loader.load("./direshebei.glb", (gltf) => {
  console.log(gltf, 28);
  gltf.scene.traverse(function (children) {
    // 遍历模型中的物体
    console.log(children, 32);
    if (children.name.includes('立方体')) {
      children.caseShadow = true;
      children.material = material; 
    }
    // 放被子的架子
    if (children.name.includes('棱角球')) {
      children.receiveShadow = true;
    }
  });
  scene.add(gltf.scene);
});

// 添加环境光
const light = new THREE.AmbientLight(0x404040, 1);
scene.add(light);

// 添加平行光
const directionLight = new THREE.DirectionalLight(0xffffff, 1);
directionLight.position.set(11.2, 11.2, 7.4);
scene.add(directionLight);

// 添加点光源
const pointLight = new THREE.PointLight(0x404040, 1);
pointLight.power = 5000;
pointLight.castShadow = true;
pointLight.position.set(2, 2, 1);
scene.add(pointLight);

// 添加灯光辅助标识
scene.add(new THREE.PointLightHelper(pointLight, 0.1));

// // 添加阴影
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// pointLight.castShadow = true;




onMounted(() => {
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 添加阴影的渲染
  renderer.shadowMap.enabled = true;
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