import {describe, expect, test} from 'bun:test'

import optis, {ProcessedOptionsMap, RequiredOptionsError} from '../src/main.ts'

describe('optis', () => {
  test('default export exposes helpers', () => {
    expect(optis.RequiredOptionsError).toBe(RequiredOptionsError)
    expect(optis.ProcessedOptionsMap).toBe(ProcessedOptionsMap)
    expect(optis.typed).toBe(optis as unknown as typeof optis.typed)
  })
})
describe('runtime processing', () => {
  test('merges defaults and normalizes present keys', () => {
    const schema = optis({
      defaults: {
        target: ' world ',
      },
      normalizations: {
        target: (value: unknown) => String(value).trim(),
      },
    })
    expect(schema.process()).toEqual({
      target: 'world',
    })
    expect(schema.process({target: ' Bun '})).toEqual({
      target: 'Bun',
    })
  })
  test('normalization-only keys are optional and only normalized when present', () => {
    let calls = 0
    const schema = optis({
      normalizations: {
        target: (value: unknown) => {
          calls++
          return String(value).toUpperCase()
        },
      },
    })
    expect(schema.process()).toEqual({})
    expect(calls).toBe(0)
    expect(schema.process({target: 'world'})).toEqual({target: 'WORLD'})
    expect(calls).toBe(1)
  })
  test('check and process validate required keys from required placeholders and requiredKeys', () => {
    const schema = optis({
      defaults: {
        host: 'example.com',
      },
      required: {
        protocol: '',
      },
      requiredKeys: ['path'],
    })
    const invalidOptions = {
      path: '/',
    } as unknown as optis.Parameter<typeof schema>
    expect(() => schema.check(invalidOptions)).toThrow(RequiredOptionsError)
    expect(() => schema.check({
      path: '/',
      protocol: 'https',
    })).not.toThrow()
    expect(schema.process({
      path: '/',
      protocol: 'https',
    })).toEqual({
      host: 'example.com',
      path: '/',
      protocol: 'https',
    })
  })
  test('process preserves identity when no runtime transforms are active', () => {
    const schema = optis({
      requiredKeys: ['apiKey'],
    })
    const options = {
      apiKey: 'secret',
    }
    expect(schema.process(options)).toBe(options)
  })
  test('extend composes runtime setup without mutating the base schema', () => {
    const base = optis({
      defaults: {
        host: 'example.com',
      },
    })
    const extended = base.extend({
      prefix: 'api',
    }).extendTyped<{
      required: {
        key: string
      }
    }>()
    expect(base.process()).toEqual({
      host: 'example.com',
    })
    expect(extended.process({
      key: 'secret',
    })).toEqual({
      host: 'example.com',
      key: 'secret',
      prefix: 'api',
    })
  })
  test('processMap returns a typed map wrapper', () => {
    const schema = optis({
      optionalKeys: ['target'],
    })
    const result = schema.processMap({
      target: 'world',
    })
    expect(result).toBeInstanceOf(ProcessedOptionsMap)
    expect(result.has('target')).toBe(true)
    expect(result.get('target')).toBe('world')
  })
})
