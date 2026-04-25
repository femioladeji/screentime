import './assets/base.css'

import { createApp } from 'vue'
import { router } from './Router'
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.mount('#app')
