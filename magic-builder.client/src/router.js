import { authSettled } from '@bcwdev/auth0provider-client'
import { createRouter, createWebHashHistory } from 'vue-router'

function loadPage(page) {
  return () => import(`./pages/${page}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadPage('HomePage')
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: loadPage('ProfilePage'),
    beforeEnter: authSettled
  },
  {
    path: '/deck/:id',
    name: 'DeckBuilder',
    component: loadPage('DeckBuilderPage'),
    beforeEnter: authSettled
  }
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})
