import { createRouter, createWebHistory } from "vue-router";
import Irrigators from "../views/Irrigators.vue";
import Login from "../views/Login.vue";
import Logout from "../views/Logout.vue";
import Dashboard from "../views/Dashboard.vue";
import { store } from "../vuex/store";

const routes = [
  {
    path: "/",
    name: "Irrigators",
    component: Irrigators,
    meta: { adminOnly: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { adminOnly: false },
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    meta: { adminOnly: false },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { adminOnly: true },
  },
  {
    path: "/issues",
    name: "Issues",
    component: () => import("../views/Issues.vue"),
    meta: { adminOnly: false },
  },
  {
    path: "/issues/create/:irrigatorId",
    name: "Issues Creation",
    component: () => import("../views/Issues.vue"),
    meta: { adminOnly: true },
  },
  {
    path: "/requests",
    name: "InstallUninstallRequests",
    component: () => import("../views/InstallUninstallRequests"),
    meta: { adminOnly: false },
  },

  {
    path: "/stock",
    name: "Stock Movements",
    component: () => import("../views/StockMovements"),
    meta: { adminOnly: true },
  },
  {
    path: "/forbidden",
    name: "Acceso denegado",
    component: () => import("../views/Forbidden"),
    meta: { adminOnly: false },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!store.state?.user?.name;
  const isAdmin = store.state?.user?.type === "admin";
  if (to.name !== "Login" && !isAuthenticated) {
    next({ name: "Login" });
  } else if (to.meta.adminOnly && !isAdmin) {
    next({ path: "/forbidden" });
  } else next();
});

export default router;
