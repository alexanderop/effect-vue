import { expect, test } from 'vitest'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import AtomPull from './AtomPull.vue'

test('pulls the next chunk on demand until the stream is exhausted', async () => {
  const mounted = mountWithRegistry(AtomPull, { label: 'Atom.pull' })
  const feed = panel('Feed')

  try {
    await eventually(() => expect(feed.element().querySelectorAll('li')).toHaveLength(4))

    await feed.getByRole('button', { name: 'Load more' }).click()
    await eventually(() => expect(feed.element().querySelectorAll('li')).toHaveLength(8))

    await feed.getByRole('button', { name: 'Load more' }).click()
    await eventually(() => expect(feed.element().querySelectorAll('li')).toHaveLength(12))

    await feed.getByRole('button', { name: 'Load more' }).click()
    await eventually(() => expect(feed.element().querySelectorAll('li')).toHaveLength(16))

    await feed.getByRole('button', { name: 'Load more' }).click()
    await expect.element(feed.getByRole('button', { name: 'End of stream' })).toBeDisabled()
  } finally {
    mounted.cleanup()
  }
})
