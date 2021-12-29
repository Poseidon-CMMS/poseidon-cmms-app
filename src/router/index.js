import { createRouter, createWebHistory } from 'vue-router'
import Irrigators from '../views/Irrigators.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem('name');
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' });
  else next()
})


export default router
