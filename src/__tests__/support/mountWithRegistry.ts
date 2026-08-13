import { AtomRegistry, registryKey } from '@effect/atom-vue'
import { createApp, type Component } from 'vue'

interface MountOptions {
  readonly label: string
  readonly registry?: AtomRegistry.AtomRegistry
}

export const mountWithRegistry = (component: Component, options: MountOptions) => {
  const host = document.createElement('section')
  host.setAttribute('aria-label', options.label)
  document.body.append(host)

  const registry = options.registry ?? AtomRegistry.make()
  const ownsRegistry = options.registry === undefined
  const app = createApp(component)

  app.provide(registryKey, registry)
  app.mount(host)

  return {
    registry,
    cleanup: () => {
      app.unmount()
      if (ownsRegistry) registry.dispose()
      host.remove()
    },
  }
}
