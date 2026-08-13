import { expect, test } from 'vitest'

import { eventually, panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

test('Atom.Fn exposes the running action, dice, and derived total', async () => {
  const mounted = mountExample('atom-fn')
  const roll = panel('ROLL')
  const dice = panel('DICE')
  const total = panel('TOTAL')

  try {
    await expect.element(dice.getByText('Press reroll', { exact: true })).toBeVisible()
    await roll.getByRole('button', { name: 'Roll Dice' }).click()
    await expect.element(roll.getByRole('button', { name: 'Rolling...' })).toBeVisible()
    await eventually(() => expect(dice.element().querySelectorAll('.die')).toHaveLength(3))
    await expect.element(total.getByText(/Total: \d+/)).toBeVisible()
    await expect.element(roll.getByRole('button', { name: 'Reroll Dice' })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
