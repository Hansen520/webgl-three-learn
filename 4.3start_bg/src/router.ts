import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("./views/login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("./views/home.vue"),
  },
];

export default createRouter({
  routes,
  history: createWebHashHistory(),
});
