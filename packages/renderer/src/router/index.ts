import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const Home = () => import('../views/Home.vue')
const HomeOverView = () => import('../views/Home/OverView.vue')
const HomeProxy = () => import('../views/Home/HomeProxy.vue')
const HomeRule = () => import('../views/Home/HomeRule.vue')
const HomeLog = () => import('../views/Home/HomeLog.vue')
const HomeSetting = () => import('../views/Home/HomeSetting.vue')

const routeRouteRecords: RouteRecordRaw[] = [{
  path: '/',
  component: Home,
  redirect: 'overview',
  children: [
    {
      name: 'HomeOverview',
      path: 'overview',
      component: HomeOverView,
    },
    {
      name: 'HomeProxy',
      path: 'proxy',
      component: HomeProxy,
    },
    {
      name: 'HomeRule',
      path: 'rule',
      component: HomeRule,
    },
    {
      name: 'HomeLog',
      path: 'log',
      component: HomeLog,
    },
    {
      name: 'HomeSetting',
      path: 'setting',
      component: HomeSetting,
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
