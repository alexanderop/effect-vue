import { createApp } from 'vue'

import ExampleView from '@/views/ExampleView.vue'

/**
 * Mount a routed example page by slug, registry and all.
 *
 * Reserved for testing the page shell itself. An example's own behaviour
 * belongs in its colocated browser spec, which mounts the root component
 * directly with `mountWithRegistry`.
 */
export const mountExampleView = (slug: string) => {
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
