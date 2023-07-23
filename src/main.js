import {createApp} from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import {registerGlobal} from "./global/index.js";
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import store from "./store"

const app = createApp(App)
app.use(registerGlobal)
app.use(store)
app.mount('#app')
