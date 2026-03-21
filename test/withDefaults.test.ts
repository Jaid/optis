import {describe, expect, test} from 'bun:test'

import {withDefaults} from '../src/main.ts'

describe('withDefaults', () => {
  test('no input returns a shallow copy of defaults', () => {
    const defaults = {
      a: 1,
      b: {c: 2},
    }
    const result = withDefaults(defaults)
    expect(result).toEqual(defaults)
    expect(result).not.toBe(defaults)
  })
  test('overrides and retains unknown keys', () => {
    const defaults = {
      a: 1,
      b: 2,
    }
    const result = withDefaults(defaults, {
      b: 3,
      c: 4,
    })
    expect(result).toEqual({
      a: 1,
      b: 3,
      c: 4,
    })
  })
  test('shallow merge replaces nested objects', () => {
    const defaults = {
      a: {
        x: 1,
        y: 2,
      },
    }
    const result = withDefaults(defaults, {a: {z: 3}})
    expect(result).toEqual({a: {z: 3}})
  })
  test('explicit undefined in input overwrites default', () => {
    const defaults = {a: 1}
    const result = withDefaults(defaults, {a: undefined})
    expect(Object.hasOwn(result, 'a')).toBe(true)
    expect(result.a).toBeUndefined()
  })
})
