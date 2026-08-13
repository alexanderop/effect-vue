import { expect, test } from 'vitest'

import { panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

test('get.result recomputes all author facts together', async () => {
  const mounted = mountExample('get-result')
  const author = panel('AUTHOR')
  const books = panel('BOOKS PUBLISHED')
  const age = panel('AGE AT DEATH')
  const rate = panel('BOOKS PER YEAR')

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
