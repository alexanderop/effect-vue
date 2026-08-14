import { AtomRegistry, registryKey } from '@effect/atom-vue'
import { createApp, type Component } from 'vue'

interface MountOptions {
  /** Accessible name of the host element, so `page.getByRole('region', …)` can scope to this mount. */
  readonly label: string
  /** Share one registry across several mounts. Omit to get a fresh, isolated one. */
  readonly registry?: AtomRegistry.AtomRegistry
}

/**
 * Mount a component with an explicit AtomRegistry.
 *
 * This is how every example's browser spec mounts its root component: the real
 * component tree, a registry that belongs to this test alone, and no router or
 * page chrome in between. Never let a test fall back to `defaultRegistry` —
 * module-scoped atoms would then leak between files.
 */
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
    host,
    registry,
    cleanup: () => {
      app.unmount()
      if (ownsRegistry) registry.dispose()
      host.remove()
    },
  }
}
