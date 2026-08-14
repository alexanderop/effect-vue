import { vi } from 'vitest'
import { page } from 'vitest/browser'

/**
 * Locate a panel by its `BasePanel` label. The label is the panel's accessible
 * name, so this is the same thing a screen reader would use — pass it in the
 * natural casing the root component declares, not the uppercase it renders as.
 */
export const panel = (label: string) => page.getByRole('region', { name: label })

/** Retry an assertion until it holds. For state that settles without a visible transition. */
export const eventually = async (assertion: () => void) => {
  await vi.waitFor(assertion, { timeout: 6_000, interval: 20 })
}
