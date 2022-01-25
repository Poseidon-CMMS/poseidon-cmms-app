import { createRouter, createWebHistory } from 'vue-router'
import Irrigators from '../views/Irrigators.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import { store } from '../vuex/store'

const routes = [
  {
    path: '/',
    name: 'Irrigators',
    component: Irrigators
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/issues',
    name: 'Issues',
    component: () => import('../views/Issues.vue')
  },
  {
    path: '/issues/create/:irrigatorId',
    name: 'Issues Creation',
    component: () => import('../views/Issues.vue')
  },
  {
    path:'/requests',
    name: 'InstallUninstallRequests',
    component: () => import('../views/InstallUninstallRequests')
  },
  
  {
    path:'/stock',
    name: 'Stock Movements',
    component: () => import('../views/StockMovements')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!store.state?.user?.name;
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' });
  else next()
})


export default router
