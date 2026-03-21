import type {InputOptions, MakerOptions} from '../src/main.ts'
import type {Arrayable} from 'type-fest'

import {describe, expect, test} from 'bun:test'

import optis, {makeOptions, RequiredOptionsError, withDefaults} from '../src/main.ts'

describe('optis', () => {
  test('default export aliases the main helper and exposes helpers', () => {
    expect(optis).toBe(makeOptions as typeof optis)
    expect(optis.RequiredOptionsError).toBe(RequiredOptionsError)
    expect(optis.withDefaults).toBe(withDefaults)
  })
})
describe('makeOptions', () => {
  test('merges defaults and user input', () => {
    const defaultOptions = {
      path: 'api' as Arrayable<string>,
      host: 'localhost',
    }
    const makerOptions = {
      defaultOptions,
      requiredKeys: ['protocol'],
    } as const satisfies MakerOptions.Static
    type Options = InputOptions<{
      defaults: typeof defaultOptions
      optional: {
        port: number
      }
      required: {
        protocol: string
      }
    }, typeof makerOptions>
    const outputOptions = makeOptions<Options>({
      protocol: 'https',
      port: 443,
    }, makerOptions)
    expect(outputOptions).toEqual({
      path: 'api',
      host: 'localhost',
      protocol: 'https',
      port: 443,
    })
  })
  test('normalizes only keys that are actually present', () => {
    let calls = 0
    type Options = InputOptions<{
      normalizations: {
        port: number
      }
      optional: {
        port: number
      }
      required: {
        protocol: string
      }
    }>
    const result = makeOptions<Options>({
      protocol: 'https',
    }, {
      requiredKeys: ['protocol'],
      normalize: {
        port: value => {
          calls++
          return (value ?? 0) + 1
        },
      },
    })
    expect(calls).toBe(0)
    expect(result).toEqual({
      protocol: 'https',
    })
  })
  test('throws RequiredOptionsError when a required key is missing at runtime', () => {
    type Options = InputOptions<{
      required: {
        host: string
        protocol: string
      }
    }>
    let error: unknown
    try {
      makeOptions<Options>({
        protocol: 'https',
      } as Options['parameter'], {
        requiredKeys: ['protocol', 'host'],
      })
    } catch (caughtError) {
      error = caughtError
    }
    expect(error).toBeInstanceOf(RequiredOptionsError)
    expect(error).toMatchObject({
      message: 'Missing required option: host',
      givenKeys: ['protocol'],
      missingKeys: ['host'],
      requiredKeys: ['protocol', 'host'],
    })
  })
})
