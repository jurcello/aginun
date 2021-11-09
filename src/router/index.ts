import Vue from "vue";
import VueRouter from "vue-router";

import { rolesGuard, hasErrorsGuard } from "./guards";
import ErrorPage from "../views/ErrorPage.vue";
import RolesOverview from "../views/RolesOverview.vue";
import AboutPage from "../views/AboutPage.vue";
import SupportPage from "../views/SupportPage.vue";
import RoleViewModal from "../components/roles/RoleViewModal.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/roles",
    name: "roles",
    beforeEnter: rolesGuard,
    component: RolesOverview,
    children: [{ path: "view/:id", component: RoleViewModal }]
  },
  {
    path: "/error",
    name: "error",
    beforeEnter: hasErrorsGuard,
    component: ErrorPage
  },
  {
    path: "/about",
    name: "about",
    component: AboutPage
  },
  {
    path: "/support",
    name: "support",
    component: SupportPage
  },
  {
    path: "/",
    redirect: "/roles"
  },
  {
    // non-existent pages redirect to the home page
    path: "*",
    redirect: "/roles"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
