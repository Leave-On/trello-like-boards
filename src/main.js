import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/assets/main.css'
import { fakeBackend } from './helpers'

fakeBackend()

const pinia = createPinia()

const app = createApp(App)

app
  .use(pinia)
  .use(router)
  .use(focus)
  .mount('#app')


