import { expect, test } from 'vitest'

import { panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

test('Micro Comments presents the signed-out conversation state', async () => {
  const mounted = mountExample('comments')
  const comments = panel('MICRO COMMENTS')

  try {
    await expect
      .element(comments.getByRole('heading', { name: 'Join the conversation' }))
      .toBeVisible()
    await expect
      .element(comments.getByRole('button', { name: 'Continue with GitHub' }))
      .toBeVisible()
    await expect.element(comments.getByText('Sign in above to post a micro comment.')).toBeVisible()
    await expect.element(comments.getByText('Loading comments...')).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
