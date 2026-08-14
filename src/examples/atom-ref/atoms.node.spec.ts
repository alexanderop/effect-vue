import { describe, expect, it } from 'vitest'

import { makeDraftRefs } from './atoms'

// No Effect, no registry, no `it.effect` — an AtomRef is plain synchronous
// state, and its spec should look like it.
describe('AtomRef', () => {
  it('propagates a prop write to the parent and to derived refs', () => {
    const { draftRef, titleRef, lengthRef } = makeDraftRefs()

    const seen: Array<number> = []
    const unsubscribe = lengthRef.subscribe((length) => seen.push(length))

    titleRef.set('Refs')

    expect(draftRef.value).toEqual({ title: 'Refs', body: '' })
    expect(lengthRef.value).toBe(4)
    expect(seen).toEqual([4])

    // The other direction works too: replacing the parent updates the prop ref.
    draftRef.set({ title: 'Refs', body: 'and collections' })
    expect(titleRef.value).toBe('Refs')
    expect(lengthRef.value).toBe(19)

    unsubscribe()
    titleRef.set('Ignored')
    expect(seen).toEqual([4, 19])
  })

  it('notifies collection subscribers on insert, change, and remove', () => {
    const { tagsRef } = makeDraftRefs()

    let notifications = 0
    const unsubscribe = tagsRef.subscribe(() => {
      notifications += 1
    })

    expect(tagsRef.toArray()).toEqual(['effect', 'vue'])

    tagsRef.push('atom')
    expect(tagsRef.toArray()).toEqual(['effect', 'vue', 'atom'])

    // A write to one item ref is a change to the collection as well, which is
    // what lets a list re-render without the parent owning every value.
    const [first] = tagsRef.value
    first!.set('effect-atom')
    expect(tagsRef.toArray()).toEqual(['effect-atom', 'vue', 'atom'])

    tagsRef.remove(first!)
    expect(tagsRef.toArray()).toEqual(['vue', 'atom'])

    expect(notifications).toBe(3)

    unsubscribe()
  })
})
