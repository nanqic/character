import { createWebHistory, createRouter } from 'vue-router'


// 1. 定义路由组件.
// 也可以从其他文件导入

// 2. 定义一些路由
const routes = [
  { path: '/', component: () => import('@/pages/home.vue') },
  { path: '/mryz', component: () => import('@/pages/everyday_handwriting.vue') },
  { path: '/zitie', component: () => import('@/pages/monument.vue') },
]

// 3. 创建路由实例并传递 `routes` 配置
const router = createRouter({
  // 4. 内部提供了 history 模式的实现
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

export default router
