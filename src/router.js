import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    name: "notFound",
    path: "/:path(.*)+",
    redirect: {
      name: "home",
    },
  },
  {
    name: "home",
    path: "/home",
    component: () => import("./view/home"),
    meta: {
      title: "首页",
    },
  },
  {
    name: "mine",
    path: "/mine",
    component: () => import("./view/mine"),
    meta: {
      title: "我的",
    },
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export { router };
