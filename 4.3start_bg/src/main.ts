/*
 * @Date: 2024-07-02 15:36:58
 * @Description: description
 */
import { createApp } from "vue";
import "./style.css";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);
app.use(router).mount("#app");
