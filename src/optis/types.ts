import type {ProcessedOptionsMapShape} from './ProcessedOptionsMap.ts'

export type Dict<ValueGeneric = unknown> = Record<string, ValueGeneric>
export type KeyList = ReadonlyArray<string> | string
export type Setup = {
  defaults?: Dict
  normalizations?: Dict
  optional?: Dict
  optionalKeys?: KeyList
  required?: Dict
  requiredKeys?: KeyList
}

export declare const schemaBrandSymbol: unique symbol

export type NormalizeSetup<SetupGeneric extends Setup> = Simplify<{
  defaults: DefaultsOf<SetupGeneric>
  normalizations: NormalizationsOf<SetupGeneric>
  optional: OptionalDeclaredOf<SetupGeneric>
  required: RequiredDeclaredOf<SetupGeneric>
}>
export type ToSetupFromInput<InputGeneric> = [InputGeneric] extends [undefined] ? {} : InputGeneric extends Dict ? HasSetupKey<InputGeneric> extends true ? NormalizeSetup<{
  defaults: InputGeneric extends {defaults: infer DefaultsGeneric extends Dict} ? DefaultsGeneric : {}
  normalizations: InputGeneric extends {normalizations: infer NormalizationsGeneric} ? NormalizerReturnTypes<NormalizationsGeneric> : {}
  optional: InputGeneric extends {optional: infer OptionalGeneric extends Dict} ? OptionalGeneric : {}
  optionalKeys: InputGeneric extends {optionalKeys: infer KeysGeneric extends KeyList} ? KeysGeneric : never
  required: InputGeneric extends {required: infer RequiredGeneric extends Dict} ? RequiredGeneric : {}
  requiredKeys: InputGeneric extends {requiredKeys: infer KeysGeneric extends KeyList} ? KeysGeneric : never
}> : {defaults: InputGeneric} : {}
export type MergeSetup<BaseSetupGeneric extends Setup, ExtensionSetupGeneric extends Setup> = Simplify<{
  defaults: Merge<DefaultsOf<NormalizeSetup<BaseSetupGeneric>>, DefaultsOf<NormalizeSetup<ExtensionSetupGeneric>>>
  normalizations: Merge<NormalizationsOf<NormalizeSetup<BaseSetupGeneric>>, NormalizationsOf<NormalizeSetup<ExtensionSetupGeneric>>>
  optional: Merge<OptionalOf<NormalizeSetup<BaseSetupGeneric>>, OptionalOf<NormalizeSetup<ExtensionSetupGeneric>>>
  required: Merge<RequiredOf<NormalizeSetup<BaseSetupGeneric>>, RequiredOf<NormalizeSetup<ExtensionSetupGeneric>>>
}>
export type ExtractSetup<InputGeneric> = InputGeneric extends {readonly [schemaBrandSymbol]: infer SetupGeneric extends Setup}
  ? SetupGeneric
  : InputGeneric extends (...args: any) => infer ReturnGeneric
    ? ExtractSetup<ReturnGeneric>
    : InputGeneric extends Setup
      ? NormalizeSetup<InputGeneric>
      : never
export type ParameterFromSetup<SetupGeneric extends Setup> = IsEmptyRecord<RequiredInputOf<NormalizeSetup<SetupGeneric>>> extends true ? ParameterObjectOf<NormalizeSetup<SetupGeneric>> | undefined : ParameterObjectOf<NormalizeSetup<SetupGeneric>>
export type ProcessedFromSetup<SetupGeneric extends Setup> = ProcessedObjectOf<NormalizeSetup<SetupGeneric>>
export type Parameter<InputGeneric> = ExtractSetup<InputGeneric> extends infer SetupGeneric extends Setup ? ParameterFromSetup<SetupGeneric> : never
export type Processed<InputGeneric> = ExtractSetup<InputGeneric> extends infer SetupGeneric extends Setup ? ProcessedFromSetup<SetupGeneric> : never
export type ProcessedMap<InputGeneric> = ProcessedOptionsMapShape<Processed<InputGeneric>>
export interface SchemaMethods {
  check: <ThisGeneric>(this: ThisGeneric, options?: Parameter<ThisGeneric>) => void
  extend: <ThisGeneric, InputGeneric extends Dict | undefined = undefined>(this: ThisGeneric, input?: InputGeneric) => Schema<MergeSetup<ExtractSetup<ThisGeneric>, ToSetupFromInput<InputGeneric>>>
  process: <ThisGeneric>(this: ThisGeneric, options?: Parameter<ThisGeneric>) => Processed<ThisGeneric>
  processMap: <ThisGeneric>(this: ThisGeneric, options?: Parameter<ThisGeneric>) => ProcessedMap<ThisGeneric>
}
export interface Schema<SetupGeneric extends Setup = {}> extends SchemaMethods {
  extendTyped: <AddedSetupGeneric extends Setup = {}>() => Schema<MergeSetup<SetupGeneric, AddedSetupGeneric>>
  readonly [schemaBrandSymbol]: NormalizeSetup<SetupGeneric>
}
export interface TypedFactory extends SchemaMethods {
  <SetupGeneric extends Setup = {}>(): Schema<SetupGeneric>
}
type SetupKey = 'defaults' | 'normalizations' | 'optional' | 'optionalKeys' | 'required' | 'requiredKeys'
type Simplify<InputGeneric> = {[Key in keyof InputGeneric]: InputGeneric[Key]} & {}
type Merge<LowPriorityGeneric extends Dict, HighPriorityGeneric extends Dict> = Simplify<Omit<LowPriorityGeneric, keyof HighPriorityGeneric> & HighPriorityGeneric>
type ReplaceValues<InputGeneric extends Dict, ReplacementGeneric extends Dict> = Simplify<{
  [Key in keyof InputGeneric]: Key extends keyof ReplacementGeneric ? ReplacementGeneric[Key] : InputGeneric[Key]
}>
type KeysToUnion<InputGeneric> = InputGeneric extends ReadonlyArray<string> ? InputGeneric[number] : InputGeneric extends string ? InputGeneric : never
type KeysToRecord<InputGeneric> = [InputGeneric] extends [never] ? {} : Record<Extract<InputGeneric, string>, unknown>
type IsEmptyRecord<InputGeneric extends Dict> = [keyof InputGeneric] extends [never] ? true : false
type DefaultsOf<SetupGeneric extends Setup> = SetupGeneric extends {defaults: infer DefaultsGeneric extends Dict} ? DefaultsGeneric : {}
type NormalizationsOf<SetupGeneric extends Setup> = SetupGeneric extends {normalizations: infer NormalizationsGeneric extends Dict} ? NormalizationsGeneric : {}
type OptionalOf<SetupGeneric extends Setup> = SetupGeneric extends {optional: infer OptionalGeneric extends Dict} ? OptionalGeneric : {}

type OptionalKeysOf<SetupGeneric extends Setup> = SetupGeneric extends {optionalKeys: infer KeysGeneric extends KeyList} ? KeysGeneric : never

type RequiredOf<SetupGeneric extends Setup> = SetupGeneric extends {required: infer RequiredGeneric extends Dict} ? RequiredGeneric : {}

type RequiredKeysOf<SetupGeneric extends Setup> = SetupGeneric extends {requiredKeys: infer KeysGeneric extends KeyList} ? KeysGeneric : never

type OptionalDeclaredOf<SetupGeneric extends Setup> = Merge<KeysToRecord<KeysToUnion<OptionalKeysOf<SetupGeneric>>>, OptionalOf<SetupGeneric>>

type RequiredDeclaredOf<SetupGeneric extends Setup> = Merge<KeysToRecord<KeysToUnion<RequiredKeysOf<SetupGeneric>>>, RequiredOf<SetupGeneric>>
type RequiredInputOf<SetupGeneric extends Setup> = Omit<RequiredDeclaredOf<SetupGeneric>, keyof DefaultsOf<SetupGeneric>>
type OptionalInputOf<SetupGeneric extends Setup> = Omit<OptionalDeclaredOf<SetupGeneric>, keyof RequiredInputOf<SetupGeneric>>
type OptionalOutputOf<SetupGeneric extends Setup> = Omit<OptionalDeclaredOf<SetupGeneric>, keyof DefaultsOf<SetupGeneric> | keyof RequiredDeclaredOf<SetupGeneric>>
type ParameterObjectOf<SetupGeneric extends Setup> = Simplify<Partial<DefaultsOf<SetupGeneric>> & Partial<OptionalInputOf<SetupGeneric>> & RequiredInputOf<SetupGeneric>>

type ProcessedObjectOf<SetupGeneric extends Setup> = ReplaceValues<Simplify<DefaultsOf<SetupGeneric> & RequiredDeclaredOf<SetupGeneric> & Partial<OptionalOutputOf<SetupGeneric>>>, NormalizationsOf<SetupGeneric>>

type HasSetupKey<InputGeneric extends Dict> = string extends keyof InputGeneric ? false : Extract<keyof InputGeneric, SetupKey> extends never ? false : true

type NormalizerReturnTypes<InputGeneric> = InputGeneric extends Record<string, (...args: any) => any> ? {
  [Key in keyof InputGeneric]: ReturnType<InputGeneric[Key]>
} : {}
