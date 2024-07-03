<template>
  <div id="login-three-container"></div>
</template>
<script setup name="login">
import { onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import _ from "lodash";

// 容器
let container;
// 场景
let scene;
// 加载图片
const IMAGE_SKY = new URL("../assets/images/sky.png", import.meta.url).href;
console.log(IMAGE_SKY, 15);
// 宽度
let width = 0;
// 高度
let height = 0;
// 深度
let depth = 1380;
// 相机z轴上的位置
let zAxisNumber = 0;
// 相机
let camera;
// 渲染器
let renderer;
// 球体的网格
let sphere;
// 点的初始参数
let parameters;
// 点的材质
let material = [];
// 点的初始位置
let particles_init_position;
// 声明点1在Z轴上的移动的位置
let zProgress;
// 声明点2在Z轴上的移动的位置
let zProgress_second;
// 声明点1的数据
let particles_first = [];
// 声明点2的数据
let particles_second = [];
// 声明星云对象1
let cloud_first;
// 声明星云对象2
let cloud_second;
// 创建星云运动的渲染函数1
let renderCloud_first;
// 创建星云运动的渲染函数2
let renderCloud_second;

const IMAGE_EARTH = new URL("../assets/images/earth_bg.png", import.meta.url).href;
const IMAGE_STAR1 = new URL("../assets/images/starflake1.png", import.meta.url).href;
const IMAGE_STAR2 = new URL("../assets/images/starflake2.png", import.meta.url).href;
const IMAGE_CLOUD = new URL("../assets/images/cloud.png", import.meta.url).href;
onMounted(() => {
  container = document.getElementById("login-three-container");
  width = container.clientWidth;
  height = container.clientHeight;
  // 初始化场景
  initScene();
  initSceneBg();
  initCamera();
  initSphereModal();
  initLight();
  // 定义初始位置
  particles_init_position = -zAxisNumber - depth / 2;
  zProgress = particles_init_position;
  zProgress_second = particles_init_position * 2;
  particles_first = initSceneStar(particles_init_position);
  particles_second = initSceneStar(zProgress_second);
  cloud_first = initCloud(400, 200);
  cloud_second = initCloud(200, 100);
  renderCloud_first = initCloudMove(
    cloud_first,
    [
      new THREE.Vector3(-width / 10, 0, -depth / 2),
      new THREE.Vector3(-width / 4, height / 8, 0),
      new THREE.Vector3(-width / 4, 0, zAxisNumber),
    ],
    0.0002
  );
  renderCloud_second = initCloudMove(
    cloud_second,
    [new THREE.Vector3(width / 8, height / 8, -depth / 2), new THREE.Vector3(width / 8, height / 8, zAxisNumber)],
    0.0008
  );
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
  const fov = 12;
  // 计算相机距离物体的距离
  const distance = width / 2 / Math.tan(Math.PI / 12);
  zAxisNumber = Math.floor(distance - 1400 / 2);
  camera = new THREE.PerspectiveCamera(fov, width / height, 1, 30000);
  // 设置相机所在的位置
  camera.position.set(-600, 550, zAxisNumber);
  // 设置相机的方向
  camera.lookAt(0, 0, 0);
};

// 初始化球体
const initSphereModal = () => {
  const geometry = new THREE.SphereGeometry(50, 64, 80);
  const material = new THREE.MeshBasicMaterial();
  material.map = new THREE.TextureLoader().load(IMAGE_EARTH);
  sphere = new THREE.Mesh(geometry, material); // 网格
  sphere.position.set(-400, 200, 300);
  // 添加到场景中
  scene.add(sphere);
};
// 光源
const initLight = () => {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xff0000, 1);
  scene.add(ambientLight);
  // 点光源
  const pointLight = new THREE.PointLight(0x404040, 1, 1000);
  pointLight.power = 70000;
  pointLight.position.set(-600, 550, -200);
  scene.add(pointLight);
};
// 星球的自传
const renderSphereRotate = () => {
  sphere.rotateY(0.009);
};

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
    [[0, 0, 1.25], sprite2, 20],
  ];
  // 创建星星
  for (let i = 0; i < 5000; i++) {
    const x = THREE.MathUtils.randFloatSpread(width);
    const y = _.random(0, height / 2);
    const z = _.random(-depth / 2, zAxisNumber);
    vertices.push(x, y, z);
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
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
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: true,
    });
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
};
// 渲染星星的运动
const renderStarMove = () => {
  // 星星的颜色交替变化
  const time = Date.now() * 0.00005;
  for (let i = 0; i < parameters.length; i++) {
    const color = parameters[i][0];
    const h = ((360 * (color[0] + time)) % 360) / 360;
    material[i].color.setHSL(color[0], color[1], parseFloat(h.toFixed(2)));
  }
  // 星星的移动
  zProgress += 2.8;
  zProgress_second += 2.8;
  if (zProgress >= zAxisNumber + depth / 2) {
    zProgress = particles_init_position;
  } else {
    particles_first.forEach((item) => {
      item.position.setZ(zProgress);
    });
  }
  if (zProgress_second >= zAxisNumber + depth / 2) {
    zProgress_second = particles_init_position * 2;
  } else {
    particles_second.forEach((item) => {
      item.position.setZ(zProgress_second);
    });
  }
};
// 渲染星云的效果
const initCloud = (width, height) => {
  const geometry = new THREE.PlaneGeometry(width, height);
  const textureLoader = new THREE.TextureLoader();
  const cloudTexture = textureLoader.load(IMAGE_CLOUD);
  const cloudMaterial = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthTest: false,
  });
  const cloud = new THREE.Mesh(geometry, cloudMaterial);
  scene.add(cloud);
  return cloud;
};

// 创建星云的运动函数
const initCloudMove = (cloud, route, speed) => {
  let cloudProgress = 0;
  // 创建三维曲线
  const curve = new THREE.CatmullRomCurve3(route);
  return () => {
    if (cloudProgress <= 1) {
      cloudProgress += speed;
      // 获取当前位置
      const point = curve.getPoint(cloudProgress);
      if (point && point.x) {
        cloud.position.set(point.x, point.y, point.z);
      }
    } else {
      cloudProgress = 0;
    }
  };
};

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
  renderStarMove();
  renderCloud_first();
  renderCloud_second();
  renderer.render(scene, camera);
};
</script>
<style scoped>
#login-three-container {
  width: 100%;
  height: 100vh;
}
</style>
