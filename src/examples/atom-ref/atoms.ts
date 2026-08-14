import { AtomRef } from '@effect/atom-vue'

export interface Draft {
  readonly title: string
  readonly body: string
}

/**
 * An AtomRef is a standalone observable cell — no registry, no atom graph.
 *
 * Everything else in this tour goes through the registry, which is what makes
 * state shareable, disposable, and testable in Node. AtomRef is the other
 * model: local, mutable, and subscribed to directly.
 *
 * Built by a factory so a test gets its own refs instead of whatever the app
 * left behind.
 */
export const makeDraftRefs = () => {
  const draftRef = AtomRef.make<Draft>({ title: 'Atoms in Vue', body: '' })

  // `prop` narrows to one field. Writing through it replaces that field on the
  // parent, so the parent's subscribers see the change too.
  const titleRef = draftRef.prop('title')
  const bodyRef = draftRef.prop('body')

  // `map` derives a read-only ref. This is `computed`, minus the component.
  const lengthRef = draftRef.map((draft) => draft.title.length + draft.body.length)

  // A collection holds one ref per item and notifies its own subscribers on
  // insert, remove, *and* a change to any item.
  const tagsRef = AtomRef.collection<string>(['effect', 'vue'])

  return { draftRef, titleRef, bodyRef, lengthRef, tagsRef }
}

export const { draftRef, titleRef, bodyRef, lengthRef, tagsRef } = makeDraftRefs()
