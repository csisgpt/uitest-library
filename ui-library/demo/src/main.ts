import { createApp } from 'vue'
import App from './App.vue'

// ایمپورت کتابخانه UI
import { BaseButton } from '../../index'
import '../../theme/index.css'

const app = createApp(App)
app.component('BaseButton', BaseButton)
app.mount('#app')
