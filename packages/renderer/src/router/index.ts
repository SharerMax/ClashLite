import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const Home = () => import('../views/Home.vue')
const HomeOverView = () => import('../views/Home/OverView.vue')
const routeRouteRecords: RouteRecordRaw[] = [{
  path: '/',
  component: Home,
  redirect: 'overview',
  children: [
    {
      path: 'overview',
      component: HomeOverView,
    },
  ],
}]
const router = createRouter({
  // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/commonIssues.html
  // electron only use Hash mode because file://
  history: createWebHashHistory(),
  routes: routeRouteRecords,
})

export default router
