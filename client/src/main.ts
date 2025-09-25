import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import i18n from './i18n'

// Vue Router 설정
const routes = [
  { path: '/', component: () => import('./pages/Home.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('./pages/not-found.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#root')
