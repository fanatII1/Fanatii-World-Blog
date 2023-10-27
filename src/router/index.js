import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/developers',
      name: 'developers',
      component: () => import('../views/DeveloperArticlesView.vue')
    },
    {
      path: '/gaming',
      name: 'gaming',
      component: () => import('../views/GamingArticlesView.vue')
    },
    {
      path: '/tech',
      name: 'tech',
      component: () => import('../views/TechArticlesView.vue')
    },
    {
      path: '/read-article/:id',
      name: 'read-article',
      component: () => import('../views/ReadArticleView.vue')
    },
    {
      path: '/author',
      name: 'author',
      component: () => import('../views/AuthorView.vue')
    }
  ]
})

export default router
