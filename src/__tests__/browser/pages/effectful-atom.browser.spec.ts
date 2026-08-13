import { expect, test } from 'vitest'

import { eventually, panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

test('Effectful Atom rolls the selected number of dice and derives a total', async () => {
  const mounted = mountExample('effectful-atom')
  const counter = panel('COUNTER')
  const dice = panel('DICE')
  const total = panel('TOTAL')

  try {
    await eventually(() => expect(dice.element().querySelectorAll('.die')).toHaveLength(3))
    await expect.element(total.getByText(/Total: \d+/)).toBeVisible()

    await counter.getByRole('button', { name: 'Increase' }).click()
    await eventually(() => expect(dice.element().querySelectorAll('.die')).toHaveLength(4))
    await expect.element(counter.getByText('4', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
