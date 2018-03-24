import Vue from "vue"
import Router from "vue-router"
const Head = () => import("./layout/CommonHeader")
const MainHome = () => import("./components/MainHome")
const MainAdd = () => import("./components/MainAdd")
const MainEdit = () => import("./components/MainEdit")

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      component: Head,
      redirect: { name: "MainHome" },
      children: [
        { path: "/home", name: "MainHome", component: MainHome },
        { path: "/add", name: "MainAdd", component: MainAdd },
        { path: "/edit", name: "MainEdit", component: MainEdit }
      ]
    }
  ]
})
