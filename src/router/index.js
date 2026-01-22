import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WikiView from '@/views/WikiView.vue'
import Doc from '@/views/Doc.vue'
import ProfileView from '@/views/ProfileView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/wiki',
      name: 'wiki',
      component: WikiView,
    },
    {
      path: '/doc',
      name: 'doc',
      component: Doc,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: "/add",
      name: "add",
      component: () => import("@/views/AddLocationView.vue"),
    },
  ],
 })

export default router
