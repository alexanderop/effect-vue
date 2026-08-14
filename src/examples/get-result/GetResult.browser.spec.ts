import { expect, test } from 'vitest'

import { panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import GetResult from './GetResult.vue'

test('recomputes all author facts together', async () => {
  const mounted = mountWithRegistry(GetResult, { label: 'get.result' })
  const author = panel('Author')
  const books = panel('Books published')
  const age = panel('Age at death')
  const rate = panel('Books per year')

  try {
    await expect.element(books.getByText('📚 37', { exact: true })).toBeVisible()
    await expect.element(age.getByText('👤 52', { exact: true })).toBeVisible()
    await expect.element(rate.getByText('📈 0.71 books/year', { exact: true })).toBeVisible()

    await author.getByRole('button', { name: 'Jane Austen' }).click()

    await expect.element(books.getByText('📚 6', { exact: true })).toBeVisible()
    await expect.element(age.getByText('👤 42', { exact: true })).toBeVisible()
    await expect.element(rate.getByText('📈 0.14 books/year', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
