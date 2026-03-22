import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'

import LoginView from './components/LoginView.vue'
import RegisterView from './components/RegisterView.vue'
import HomeView from './components/HomeView.vue'
import TopicsView from './components/TopicsView.vue'
import QuizView from './components/QuizView.vue'
import ResultsView from './components/ResultsView.vue'
import AnswerHistoryView from './components/AnswerHistoryView.vue'
import ProfileView from './components/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/subjects/:slug/topics', name: 'topics', component: TopicsView, props: true },
    { path: '/quiz/:topicId', name: 'quiz', component: QuizView, props: true },
    { path: '/results', name: 'results', component: ResultsView },
    { path: '/answers', name: 'answers', component: AnswerHistoryView },
    { path: '/profile', name: 'profile', component: ProfileView },
  ]
})

// Navigation guard — redirect to home if already logged in
router.beforeEach((to, from) => {
  const token = localStorage.getItem('ucilica_token')
  if ((to.name === 'login' || to.name === 'register') && token) {
    return { name: 'home' }
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
