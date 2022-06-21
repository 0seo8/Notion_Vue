import { createApp, marRaw } from 'vue'
import {createPinia} from 'pinia'
import router from './routes'
import App from './App.vue'

const pinia = createPinia()
pinia.use(({store}) => {
  store.$router = marRaw(router)
})

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
