import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
