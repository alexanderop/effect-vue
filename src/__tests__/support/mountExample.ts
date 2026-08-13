import { createApp } from 'vue'

import ExampleView from '../../views/ExampleView.vue'

export const mountExample = (slug: string) => {
  const host = document.createElement('div')
  document.body.append(host)

  const app = createApp(ExampleView, { slug })
  app.mount(host)

  return {
    host,
    cleanup: () => {
      app.unmount()
      host.remove()
    },
  }
}
