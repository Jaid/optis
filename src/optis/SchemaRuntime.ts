import type {Dict, KeyList, MergeSetup, ParameterFromSetup, ProcessedFromSetup, Schema, Setup, ToSetupFromInput} from './types.ts'

import {ProcessedOptionsMap} from './ProcessedOptionsMap.ts'
import {RequiredOptionsError} from './RequiredOptionsError.ts'

const runtimeStateSymbol = Symbol('optis.runtimeState')
const setupKeys = ['defaults', 'normalizations', 'optional', 'optionalKeys', 'required', 'requiredKeys'] as const
const setupKeySet = new Set<string>(setupKeys)

type RuntimeState = Readonly<{
  defaults: Readonly<Dict>
  normalizations: Readonly<Record<string, (value: unknown) => unknown>>
  requiredKeys: ReadonlyArray<string>
}>

type RuntimeCarrier = {
  [runtimeStateSymbol]: RuntimeState
}

const makeRuntimeState = (state: {
  defaults?: Dict
  normalizations?: Record<string, (value: unknown) => unknown>
  requiredKeys?: ReadonlyArray<string>
} = {}): RuntimeState => {
  return Object.freeze({
    defaults: Object.freeze({...state.defaults}),
    normalizations: Object.freeze({...state.normalizations}),
    requiredKeys: Object.freeze([...state.requiredKeys ?? []]),
  })
}
const emptyRuntimeState = makeRuntimeState()
const schemaMethodNames = ['check', 'process', 'processMap', 'extend', 'extendTyped'] as const
function assertRecord(value: unknown, label: string): asserts value is Dict {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object.`)
  }
}
function assertOptionalRecord(value: unknown, label: string): asserts value is Dict | undefined {
  if (value === undefined) {
    return
  }
  assertRecord(value, label)
}
const toKeyArray = (value: KeyList | undefined, label: string) => {
  if (value === undefined) {
    return []
  }
  if (typeof value === 'string') {
    return [value]
  }
  if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
    return [...value]
  }
  throw new TypeError(`${label} must be a string or an array of strings.`)
}
const toRecord = (value: unknown, label: string): Dict => {
  if (value === undefined) {
    return {}
  }
  assertRecord(value, label)
  return value
}
const toNormalizations = (value: unknown, label: string): Record<string, (value: unknown) => unknown> => {
  const record = toRecord(value, label)
  const entries = Object.entries(record)
  for (const [key, normalizer] of entries) {
    if (typeof normalizer !== 'function') {
      throw new TypeError(`${label}.${key} must be a function.`)
    }
  }
  return Object.fromEntries(entries) as Record<string, (value: unknown) => unknown>
}
const uniqueStrings = (values: Iterable<string>) => {
  const seen = new Set<string>
  const output = []
  for (const value of values) {
    if (seen.has(value)) {
      continue
    }
    seen.add(value)
    output.push(value)
  }
  return output
}
const hasSetupKey = (value: Dict) => {
  return Object.keys(value).some(key => setupKeySet.has(key))
}
const getRuntimeState = (value: object): RuntimeState => {
  if (Object.hasOwn(value, runtimeStateSymbol)) {
    return (value as RuntimeCarrier)[runtimeStateSymbol]
  }
  return emptyRuntimeState
}
const attachRuntimeState = <TargetGeneric extends object>(target: TargetGeneric, state: RuntimeState) => {
  Object.defineProperty(target, runtimeStateSymbol, {
    configurable: false,
    enumerable: false,
    value: state,
    writable: false,
  })
  return target
}
const assertRequiredKeys = (requiredKeys: ReadonlyArray<string>, givenKeys: ReadonlyArray<string>) => {
  const givenKeySet = new Set(givenKeys)
  for (const key of requiredKeys) {
    if (!givenKeySet.has(key)) {
      throw new RequiredOptionsError(givenKeys, requiredKeys)
    }
  }
}

export const toRuntimeState = (input?: Dict): RuntimeState => {
  if (input === undefined) {
    return emptyRuntimeState
  }
  assertRecord(input, 'Optis setup')
  if (!hasSetupKey(input)) {
    return makeRuntimeState({
      defaults: input,
    })
  }
  const defaults = toRecord(input.defaults, 'Optis setup.defaults')
  const normalizations = toNormalizations(input.normalizations, 'Optis setup.normalizations')
  const required = toRecord(input.required, 'Optis setup.required')
  const requiredKeys = uniqueStrings([
    ...Object.keys(required),
    ...toKeyArray(input.requiredKeys as KeyList | undefined, 'Optis setup.requiredKeys'),
  ])
  return makeRuntimeState({
    defaults,
    normalizations,
    requiredKeys,
  })
}

const mergeRuntimeStates = (base: RuntimeState, extensionInput?: Dict): RuntimeState => {
  const extension = toRuntimeState(extensionInput)
  if (extension === emptyRuntimeState) {
    return base
  }
  if (base === emptyRuntimeState) {
    return extension
  }
  return makeRuntimeState({
    defaults: {
      ...base.defaults,
      ...extension.defaults,
    },
    normalizations: {
      ...base.normalizations,
      ...extension.normalizations,
    },
    requiredKeys: uniqueStrings([
      ...base.requiredKeys,
      ...extension.requiredKeys,
    ]),
  })
}
const resolveOptionsSource = (options?: Dict) => {
  return options ?? {}
}
class SchemaRuntime<SetupGeneric extends Setup = {}> {
  constructor(state: RuntimeState = emptyRuntimeState) {
    attachRuntimeState(this, state)
    Object.freeze(this)
  }

  check(options?: ParameterFromSetup<SetupGeneric>) {
    assertOptionalRecord(options, 'Optis options')
    const state = getRuntimeState(this)
    if (state.requiredKeys.length === 0) {
      return
    }
    const givenKeys = uniqueStrings([
      ...Object.keys(state.defaults),
      ...Object.keys(options ?? {}),
    ])
    assertRequiredKeys(state.requiredKeys, givenKeys)
  }

  extend<InputGeneric extends Dict | undefined = undefined>(input?: InputGeneric): Schema<MergeSetup<SetupGeneric, ToSetupFromInput<InputGeneric>>> {
    return new SchemaRuntime<MergeSetup<SetupGeneric, ToSetupFromInput<InputGeneric>>>(mergeRuntimeStates(getRuntimeState(this), input)) as unknown as Schema<MergeSetup<SetupGeneric, ToSetupFromInput<InputGeneric>>>
  }

  extendTyped<AddedSetupGeneric extends Setup = {}>(): Schema<MergeSetup<SetupGeneric, AddedSetupGeneric>> {
    return new SchemaRuntime<MergeSetup<SetupGeneric, AddedSetupGeneric>>(getRuntimeState(this)) as unknown as Schema<MergeSetup<SetupGeneric, AddedSetupGeneric>>
  }

  process(options?: ParameterFromSetup<SetupGeneric>): ProcessedFromSetup<SetupGeneric> {
    assertOptionalRecord(options, 'Optis options')
    const state = getRuntimeState(this)
    const source = resolveOptionsSource(options)
    let output: Dict | undefined
    if (Object.keys(state.defaults).length > 0) {
      output = {
        ...state.defaults,
        ...source,
      }
    }
    const merged = output ?? source
    if (state.requiredKeys.length > 0) {
      assertRequiredKeys(state.requiredKeys, Object.keys(merged))
    }
    if (Object.keys(state.normalizations).length > 0) {
      for (const [key, normalizer] of Object.entries(state.normalizations)) {
        if (!Object.hasOwn(merged, key)) {
          continue
        }
        if (!output) {
          output = {
            ...source,
          }
        }
        output[key] = normalizer(output[key])
      }
    }
    return (output ?? source) as ProcessedFromSetup<SetupGeneric>
  }

  processMap(options?: ParameterFromSetup<SetupGeneric>) {
    return new ProcessedOptionsMap(this.process(options))
  }
}
// eslint-disable-next-line perfectionist/sort-modules
export function createSchema<SetupGeneric extends Setup = {}>(state: RuntimeState = emptyRuntimeState): Schema<SetupGeneric> {
  return new SchemaRuntime<SetupGeneric>(state) as unknown as Schema<SetupGeneric>
}

export const attachSchemaBehavior = <TargetGeneric extends Function>(target: TargetGeneric, state: RuntimeState = emptyRuntimeState) => {
  attachRuntimeState(target, state)
  for (const methodName of schemaMethodNames) {
    const descriptor = Object.getOwnPropertyDescriptor(SchemaRuntime.prototype, methodName)
    if (!descriptor) {
      continue
    }
    Object.defineProperty(target, methodName, descriptor)
  }
  return target
}
