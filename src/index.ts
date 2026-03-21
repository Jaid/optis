import type {Dict} from './types/Dict.ts'
import type {IsNonEmptyRecord} from './types/IsNonEmptyRecord.ts'
import type {MergeThree} from './types/MergeThree.ts'
import type {SchemaAndKeys} from './types/SchemaAndKeys.ts'
import type {Exact, Merge, Simplify, UnionToTuple} from 'type-fest'

import {RequiredOptionsError} from './RequiredOptionsError.ts'

export type InputOptions<SetupGeneric extends InputOptions.Setup = {}, MakerOptionsGeneric extends MakerOptions.Static = {}> = {
  defaults: ToDefaults<SetupGeneric, MakerOptionsGeneric>
  merged: ToMerged<SetupGeneric, MakerOptionsGeneric>
  normalizations: IsNonEmptyRecord.Then<NormalizationsOf<SetupGeneric>, NormalizationsOf<SetupGeneric>, {}>
  normalized: IsNonEmptyRecord.Then<NormalizationsOf<SetupGeneric>, ToNormalized<SetupGeneric, MakerOptionsGeneric>, ToMerged<SetupGeneric, MakerOptionsGeneric>>
  optional: ToOptional<SetupGeneric>
  parameter: ToParameter<SetupGeneric, MakerOptionsGeneric>
  required: ToRequired<SetupGeneric, MakerOptionsGeneric>
}

type DefaultsOf<SetupGeneric extends InputOptions.Setup> = SetupGeneric extends {defaults: infer Defaults extends Dict} ? Defaults : {}

type NormalizationsOf<SetupGeneric extends InputOptions.Setup> = SetupGeneric extends {normalizations: infer Normalizations extends Dict} ? Normalizations : {}

type OptionalOf<SetupGeneric extends InputOptions.Setup> = SetupGeneric extends {optional: infer Optional extends Dict} ? Optional : {}

type OptionalKeysOf<SetupGeneric extends InputOptions.Setup> = SetupGeneric extends {optionalKeys: infer Keys extends ReadonlyArray<string> | string} ? Keys : undefined

type RequiredOf<SetupGeneric extends InputOptions.Setup> = SetupGeneric extends {required: infer Required extends Dict} ? Required : {}

type RequiredKeysOf<SetupGeneric extends InputOptions.Setup> = SetupGeneric extends {requiredKeys: infer Keys extends ReadonlyArray<string> | string} ? Keys : undefined

type DefaultOptionsOf<MakerOptionsGeneric extends MakerOptions.Static> = MakerOptionsGeneric extends {defaultOptions: infer DefaultOptions extends Dict} ? DefaultOptions : {}

type RequiredKeysFromMaker<MakerOptionsGeneric extends MakerOptions.Static> = MakerOptionsGeneric extends {requiredKeys: infer Keys extends ReadonlyArray<string> | string} ? Keys : undefined

type ReplaceValues<InputGeneric extends Dict, SchemaGeneric extends Dict> = Simplify<{
  [Key in keyof InputGeneric]: Key extends keyof SchemaGeneric ? SchemaGeneric[Key] : InputGeneric[Key]
}>

type ToDefaults<SetupGeneric extends InputOptions.Setup, MakerOptionsGeneric extends MakerOptions.Static = {}> = Merge<DefaultOptionsOf<MakerOptionsGeneric>, DefaultsOf<SetupGeneric>>

type ToRequired<SetupGeneric extends InputOptions.Setup, MakerOptionsGeneric extends MakerOptions.Static = {}> = Simplify<Omit<SchemaAndKeys<SchemaAndKeys<RequiredOf<SetupGeneric>, RequiredKeysFromMaker<MakerOptionsGeneric>>, RequiredKeysOf<SetupGeneric>>, keyof ToDefaults<SetupGeneric, MakerOptionsGeneric>>>

type ToOptional<SetupGeneric extends InputOptions.Setup> = Partial<SchemaAndKeys<OptionalOf<SetupGeneric>, OptionalKeysOf<SetupGeneric>>>

type ToMerged<SetupGeneric extends InputOptions.Setup, MakerOptionsGeneric extends MakerOptions.Static = {}> = MergeThree<ToDefaults<SetupGeneric, MakerOptionsGeneric>, ToOptional<SetupGeneric>, ToRequired<SetupGeneric, MakerOptionsGeneric>>

type ToNormalized<SetupGeneric extends InputOptions.Setup, MakerOptionsGeneric extends MakerOptions.Static = {}> = ReplaceValues<ToMerged<SetupGeneric, MakerOptionsGeneric>, NormalizationsOf<SetupGeneric>>

type ToParameter<SetupGeneric extends InputOptions.Setup, MakerOptionsGeneric extends MakerOptions.Static = {}> = Exact<MergeThree<Partial<ToDefaults<SetupGeneric, MakerOptionsGeneric>>, ToOptional<SetupGeneric>, ToRequired<SetupGeneric, MakerOptionsGeneric>>, {}> | undefined

export namespace InputOptions {
  export type Setup = {
    defaults?: Dict
    normalizations?: Dict
    optional?: Dict
    optionalKeys?: ReadonlyArray<string> | string
    required?: Dict
    requiredKeys?: ReadonlyArray<string> | string
  }

  export namespace Setup {
    export type Coerce<InputOptionsGeneric extends InputOptions | Setup> = InputOptionsGeneric extends InputOptions<infer SetupGeneric>
      ? SetupGeneric
      : InputOptionsGeneric extends Setup
        ? InputOptionsGeneric
        : never
  }

  export type Static = {
    defaults: Dict
    merged: Dict
    normalizations: Dict
    normalized: Dict
    optional: Dict
    parameter: Dict | undefined
    required: Dict
  }

  export type ApplyMakerOptions<InputOptionsGeneric extends InputOptions, MakerOptionsGeneric extends MakerOptions<InputOptionsGeneric>> = InputOptions<Setup.Coerce<InputOptionsGeneric>, MakerOptionsGeneric>

  export type From<InputOptionsGeneric extends InputOptions | Setup> = InputOptionsGeneric extends InputOptions
    ? InputOptionsGeneric
    : InputOptionsGeneric extends Setup
      ? InputOptions<InputOptionsGeneric>
      : never
}

export type MakerOptions<InputOptionsGeneric extends InputOptions.Static | undefined = undefined> = IsNonEmptyRecord.Then<InputOptionsGeneric, IsNonEmptyRecord.Then<NonNullable<InputOptionsGeneric>['required'], {
  requiredKeys: Readonly<UnionToTuple<keyof NonNullable<InputOptionsGeneric>['required']>>
}, {}> & IsNonEmptyRecord.Then<NonNullable<InputOptionsGeneric>['defaults'], {
  defaultOptions: NonNullable<InputOptionsGeneric>['defaults']
}, {}> & IsNonEmptyRecord.Then<NonNullable<InputOptionsGeneric>['normalizations'], {
  normalize: {
    [Key in keyof NonNullable<InputOptionsGeneric>['normalizations']]: (value: Key extends keyof NonNullable<InputOptionsGeneric>['merged'] ? NonNullable<InputOptionsGeneric>['merged'][Key] : never) => NonNullable<InputOptionsGeneric>['normalizations'][Key]
  }
}, {}>, MakerOptions.Static>

export namespace MakerOptions {
  export type Static = {
    defaultOptions?: Dict
    normalize?: Record<string, (value: unknown) => unknown>
    requiredKeys?: ReadonlyArray<string> | string
  }
}

const toRequiredKeyArray = (value: ReadonlyArray<string> | string): Array<string> => {
  if (typeof value === 'string') {
    return [value]
  }
  return value.map(item => item)
}

export const makeOptions = <InputOptionsGeneric extends InputOptions.Static>(input: InputOptionsGeneric['parameter'], makerOptions?: MakerOptions<InputOptionsGeneric>) => {
  type RuntimeInputOptions = InputOptions<InputOptions.Setup.Coerce<InputOptionsGeneric>, MakerOptions<InputOptionsGeneric>>
  const resolvedMakerOptions = (makerOptions ?? {}) as MakerOptions.Static
  const defaultOptions = resolvedMakerOptions.defaultOptions
  const normalize = resolvedMakerOptions.normalize
  const requiredKeys = resolvedMakerOptions.requiredKeys
  const output = {
    ...defaultOptions,
    ...input,
  } as RuntimeInputOptions['merged']
  if (requiredKeys) {
    const givenKeys = Object.keys(output)
    const givenKeySet = new Set(givenKeys)
    const requiredKeysArray = toRequiredKeyArray(requiredKeys)
    for (const key of requiredKeysArray) {
      if (!givenKeySet.has(key)) {
        throw new RequiredOptionsError(givenKeys, requiredKeysArray)
      }
    }
  }
  if (normalize) {
    const givenKeySet = new Set(Object.keys(output))
    const mutableOutput = output as Dict
    for (const [key, normalizeValue] of Object.entries(normalize)) {
      if (!givenKeySet.has(key)) {
        continue
      }
      mutableOutput[key] = normalizeValue(mutableOutput[key])
    }
  }
  return output as RuntimeInputOptions['normalized']
}

/**
 * Shallow merge helper: merge `input` into `defaults`.
 *
 * - Unknown keys from `input` are preserved.
 * - `undefined` values in `input` overwrite defaults.
 * - Nested objects are replaced instead of deep-merged.
 */
export const withDefaults = <DefaultsGeneric extends Dict, InputGeneric extends Dict = Partial<DefaultsGeneric>>(defaults: DefaultsGeneric, input?: InputGeneric): Merge<DefaultsGeneric, InputGeneric> => {
  return {
    ...defaults,
    ...input,
  } as Merge<DefaultsGeneric, InputGeneric>
}

const optis = Object.assign(makeOptions, {
  RequiredOptionsError,
  withDefaults,
})

export default optis
export {optis, RequiredOptionsError}
