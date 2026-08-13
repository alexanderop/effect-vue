import { Atom, AsyncResult } from '@effect/atom-vue'
import { Effect } from 'effect'

export interface LikeStatus {
  readonly isLiked: boolean
  readonly count: number
}

export const simulateFailureAtom = Atom.make(false)

let isLiked = false
const baseLikes = 41

const readLikeStatus = Effect.sync(
  (): LikeStatus => ({
    isLiked,
    count: isLiked ? baseLikes + 1 : baseLikes,
  }),
)

export const likeStatusAtom = Atom.make(readLikeStatus)
export const optimisticLikeStatusAtom = Atom.optimistic(likeStatusAtom)

const persistLikeAtom = Atom.fn((liked: boolean) =>
  Effect.gen(function* () {
    const shouldFail = yield* Atom.get(simulateFailureAtom)
    yield* Effect.sleep('1200 millis')

    if (shouldFail) return yield* Effect.fail('Network error')
    isLiked = liked
  }),
)

export const setLikeAtom = Atom.optimisticFn(optimisticLikeStatusAtom, {
  reducer: (result, liked: boolean) => {
    const currentCount = AsyncResult.isSuccess(result) ? result.value.count : baseLikes
    const unlikedCount =
      AsyncResult.isSuccess(result) && result.value.isLiked ? currentCount - 1 : currentCount

    return AsyncResult.success({
      isLiked: liked,
      count: liked ? unlikedCount + 1 : unlikedCount,
    })
  },
  fn: persistLikeAtom,
})
