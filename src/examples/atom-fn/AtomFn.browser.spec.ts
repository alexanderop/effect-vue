import { expect, test } from 'vitest'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import AtomFn from './AtomFn.vue'

test('exposes the running action, the dice, and the derived total', async () => {
  const mounted = mountWithRegistry(AtomFn, { label: 'Atom.fn' })
  const roll = panel('Roll')
  const dice = panel('Dice')
  const total = panel('Total')

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
