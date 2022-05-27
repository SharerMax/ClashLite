import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const home = () => import('../views/Home.vue')
const routeRouteRecords: RouteRecordRaw[] = [{
  path: '/',
  component: home,
}]
const router = createRouter({
  // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/commonIssues.html
  // electron only use Hash mode because file://
  history: createWebHashHistory(),
  routes: routeRouteRecords,
})

export default router
