import { expect, test } from 'vitest'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import EffectfulAtom from './EffectfulAtom.vue'

test('rolls the selected number of dice and derives a total', async () => {
  const mounted = mountWithRegistry(EffectfulAtom, { label: 'Effectful Atom' })
  const counter = panel('Counter')
  const dice = panel('Dice')
  const total = panel('Total')

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
