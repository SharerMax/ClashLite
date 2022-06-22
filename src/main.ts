import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import './samples/node-api'
import 'uno.css'
import 'vfonts/FiraCode.css'

createApp(App).use(router)
  .mount('#app')
  .$nextTick(window.removeLoading)
