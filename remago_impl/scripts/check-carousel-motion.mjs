// Run with Node 22.12+: node --experimental-strip-types scripts/check-carousel-motion.mjs
import assert from 'node:assert/strict'
import test from 'node:test'
import { carouselMotionReducer as reduce, initialCarouselMotion as initial } from '../src/hooks/useCarouselMotion.ts'

const start = (state, reduced = false) => reduce(state, { type: 'start', target: state.requested, reduced })
const move = (state, direction) => reduce(state, { type: 'move', direction })
const finish = state => reduce(state, { type: 'finish', revision: state.revision })
const select = (state, index, count) => reduce(state, { type: 'select', index, count })
const visible = (state, count) => ((state.current % count) + count) % count

test('next/previous retain the outgoing slide until the transition finishes', () => {
  let state = start(move(initial, 1))
  assert.equal(state.current, 1)
  assert.equal(state.previous, 0)
  assert.equal(state.direction, 1)
  state = start(move(finish(state), -1))
  assert.equal(state.current, 0)
  assert.equal(state.previous, 1)
  assert.equal(state.direction, -1)
  assert.equal(finish(state).previous, null)
})

test('rapid clicks queue the requested slide without replacing an ongoing animation', () => {
  let state = start(move(initial, 1))
  for (let i = 0; i < 4; i += 1) state = move(state, 1)
  assert.equal(start(state), state)
  assert.equal(state.current, 1)
  assert.equal(state.requested, 5)
  state = start(finish(state))
  assert.equal(state.current, 5)
  assert.equal(state.previous, 1)
})

test('changing direction during a transition preserves the latest request', () => {
  let state = start(move(initial, 1))
  state = move(move(state, -1), -1)
  state = start(finish(state))
  assert.equal(state.current, -1)
  assert.equal(state.direction, -1)
  assert.equal(visible(state, 9), 8)
})

test('loop boundaries move in the requested direction', () => {
  let state = start(move(initial, -1))
  assert.equal(visible(state, 8), 7)
  assert.equal(state.direction, -1)
  state = start(move(finish(state), 1))
  assert.equal(visible(state, 8), 0)
  assert.equal(state.direction, 1)
})

test('dot selection takes the shortest path, including across the loop boundary', () => {
  let state = start(select(initial, 7, 8))
  assert.equal(state.current, -1)
  assert.equal(state.direction, -1)
  state = start(select(finish(state), 1, 8))
  assert.equal(visible(state, 8), 1)
  assert.equal(state.direction, 1)
})

test('a stale preparation or completion cannot replace the latest transition', () => {
  const requested = move(move(initial, 1), 1)
  assert.equal(reduce(requested, { type: 'start', target: 1, reduced: false }), requested)
  const state = start(requested)
  assert.equal(reduce(state, { type: 'finish', revision: state.revision - 1 }), state)
})

test('reduced motion switches without retaining an animated outgoing layer', () => {
  const state = start(move(initial, 1), true)
  assert.equal(state.current, 1)
  assert.equal(state.previous, null)
})

test('selecting the current dot and single-item carousels do not animate', () => {
  assert.equal(start(select(initial, 0, 8)).revision, 0)
  assert.equal(select(initial, 0, 1), initial)
})
