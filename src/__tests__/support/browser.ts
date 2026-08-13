import { vi } from 'vitest'
import { page } from 'vitest/browser'

export const panel = (name: string) => page.getByRole('region', { name })

export const eventually = async (assertion: () => void) => {
  await vi.waitFor(assertion, { timeout: 6_000, interval: 20 })
}
