import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import './styles/main.css'

// The host app is just the shell and the router. Atoms are never created here:
// every example runs inside the REPL's sandbox iframe, which provides its own
// registry (see the generated `App.vue` in `src/playground/buildFiles.ts`).
const app = createApp(App)

app.use(router)

app.mount('#app')
