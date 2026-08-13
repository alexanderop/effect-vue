import { Atom } from '@effect/atom-vue'
import { Schedule, Stream } from 'effect'

// A Stream-backed atom emits every value the Stream produces. The subscription
// starts on mount and is interrupted when the last subscriber unmounts, so
// navigating away really does stop the clock.
export const ticksAtom = Atom.make(Stream.fromSchedule(Schedule.spaced('300 millis')))

export const elapsedAtom = Atom.make((get) => {
  const ticks = get(ticksAtom)
  return ticks._tag === 'Success' ? ((ticks.value + 1) * 0.3).toFixed(1) : '0.0'
})
