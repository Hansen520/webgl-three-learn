<template>
  <div id="login-three-container"></div>
</template>
<script setup name="login">
import { onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import _ from 'lodash';

// 容器
let container;
// 场景
let scene;
// 加载图片
const IMAGE_SKY = new URL("../assets/images/sky.png", import.meta.url).href;
console.log(IMAGE_SKY, 15);
// 宽度
let width;
// 高度
let height;
// 深度
let depth = 1400;
// 相机z轴上的位置
let zAxisNumber;
// 相机
let camera;
// 渲染器
let renderer;
// 球体的网格
let sphere;
// 点的初始参数
let parameters
// 点的材质
let material = [];
// 点的初始位置
let particles_init_position;

const IMAGE_EARTH = new URL('../assets/images/earth_bg.png', import.meta.url).href;
const IMAGE_STAR1 = new URL('../assets/images/starflake1.png', import.meta.url).href;
const IMAGE_STAR2 = new URL('../assets/images/starflake2.png', import.meta.url).href;
onMounted(() => {
  container = document.getElementById("login-three-container");
  width = container.clientWidth;
  height = container.clientHeight;
  console.log(container);
  initScene();
  initSceneBg();
  initCamera();
  initSphereModal();
  initLight();
  // 定义初始位置
  particles_init_position = -zAxisNumber - depth / 2;
  initSceneStar(particles_init_position);
  initRenderer();
  initOrbitControls();
  animate();
});
// 初始化场景
const initScene = () => {
  scene = new THREE.Scene();
  // 添加雾的效果
  scene.fog = new THREE.Fog(0x000000, 1, 10000);
};

// 添加背景
const initSceneBg = () => {
  new THREE.TextureLoader().load(IMAGE_SKY, (texture) => {
    // 创建立方体
    const geometry = new THREE.BoxGeometry(width, height, depth);
    // 创建立方体材质
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    // 创建立方体网格
    const mesh = new THREE.Mesh(geometry, material);
    // 设置立方体位置
    // mesh.position.z = -depth / 2;
    // 添加到场景中
    scene.add(mesh);
  });
};

// 初始化相机
const initCamera = () => {
  // 视野夹角
  const fov = 15;
  // 计算相机距离物体的距离
  const distance = width / 2 / Math.tan(Math.PI / 12);
  zAxisNumber = Math.floor(distance - 1400 / 2);
  camera = new THREE.PerspectiveCamera(fov, width / height, 1, 30000);
  // 设置相机所在的位置
  camera.position.set(0, 0, zAxisNumber);
  // 设置相机的方向
  camera.lookAt(0, 0, 0);
};

// 初始化球体
const initSphereModal = () => {
    const geometry = new THREE.SphereGeometry(50, 64, 32);
    const material = new THREE.MeshBasicMaterial();
    material.map = new THREE.TextureLoader().load(IMAGE_EARTH);
    sphere = new THREE.Mesh(geometry, material); // 网格
    sphere.position.set(-400, 200, -200);
    // 添加到场景中
    scene.add(sphere);
}
// 光源
const initLight = () => {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    // 点光源
    const pointLight = new THREE.PointLight(0x0655fd, 5, 0);
    pointLight.position.set(0, 100, -200);
    scene.add(pointLight);
}
// 星球的自传
const renderSphereRotate = () => {
    sphere.rotateY(0.001);
}

// 初始场景星星的效果
const initSceneStar = (initZPosition) => {
    const geometry = new THREE.BufferGeometry();
    // 设置星星的位置
    const vertices = [];
    // 创建纹理
    const textureLoader = new THREE.TextureLoader();
    const sprite1 = textureLoader.load(IMAGE_STAR1);
    const sprite2 = textureLoader.load(IMAGE_STAR2);
    // 星星的数据
    const pointsGeometry = [];
    // 声明点的参数
    parameters = [
        [[0.6, 100, 0.75], sprite1, 50],
        [[0, 0, 1], sprite2, 20]
    ]
    // 创建星星
    for (let i = 0; i < 1510; i++) {
        const x = THREE.MathUtils.randFloatSpread(width);
        const y = _.random(0, height / 2);
        const z = _.random(-depth / 2, zAxisNumber);
        vertices.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    // 创建两种不同的材质
    for (let i = 0; i < parameters.length; i++) {
        // 颜色
        const color = parameters[i][0];
        // 纹理
        const sprite = parameters[i][1];
        // 点的大小
        const size = parameters[i][2];
        material[i] = new THREE.PointsMaterial({
            size,
            map: sprite,
        })
        // 设置颜色
        material[i].color.setHSL(color[0], color[1], color[2]);
        // 创建物体
        const particle = new THREE.Points(geometry, material[i]);
        particle.rotation.x = Math.random() * 0.2 - 0.15;
        particle.rotation.y = Math.random() * 0.2 - 0.15;
        particle.rotation.z = Math.random() * 0.2 - 0.15;
        particle.position.setZ(initZPosition);
        pointsGeometry.push(particle);
        scene.add(particle);
        
    }
    return pointsGeometry;
}

// 渲染器
const initRenderer = () => {
  renderer = new THREE.WebGLRenderer();
  // 定义渲染器的大小
  renderer.setSize(width, height);
  // 设置渲染器背景颜色
  renderer.setClearColor(0x000000, 1);
  // 添加渲染器到DOM中
  container.appendChild(renderer.domElement);
};

// 添加轨道控制器
const initOrbitControls = () => {
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()
  controls.enabled = true;
  controls.update();
};

// 动画刷新
const animate = () => {
  requestAnimationFrame(animate);
  renderSphereRotate();
  renderer.render(scene, camera);
};
</script>
<style scoped>
#login-three-container {
  width: 100%;
  height: 100vh;
}
</style>