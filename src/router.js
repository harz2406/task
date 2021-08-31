import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/accounts",
      name: "accounts",
      component: () => import("./components/Accounts")
    },
    {
      path: "/accounts/:id",
      name: "account-details",
      component: () => import("./components/Account")
    },
    {
      path: "/add",
      name: "add",
      component: () => import("./components/AddTutorial")
    }
  ]
});
