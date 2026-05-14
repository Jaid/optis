import type { Dict as DictType, Parameter as ParameterType, ProcessedMap as ProcessedMapType, Processed as ProcessedType, Schema as SchemaType, Setup as SetupType, ToSetupFromInput, TypedFactory as TypedFactoryType } from './optis/types.ts';
import { ProcessedOptionsMap as ProcessedOptionsMapValue } from './optis/ProcessedOptionsMap.ts';
import { RequiredOptionsError as RequiredOptionsErrorValue } from './optis/RequiredOptionsError.ts';
declare function optis(): SchemaType;
declare function optis<InputGeneric extends DictType>(input: InputGeneric): SchemaType<ToSetupFromInput<InputGeneric>>;
declare namespace optis {
    type Dict<ValueGeneric = unknown> = DictType<ValueGeneric>;
    type Setup = SetupType;
    type Schema<SetupGeneric extends Setup = {}> = SchemaType<SetupGeneric>;
    type Parameter<InputGeneric> = ParameterType<InputGeneric>;
    type Processed<InputGeneric> = ProcessedType<InputGeneric>;
    type ProcessedMap<InputGeneric> = ProcessedMapType<InputGeneric>;
    const typed: TypedFactoryType;
    const ProcessedOptionsMap: {
        new <OptionsGeneric extends Record<string, unknown> = Record<string, unknown>>(options?: OptionsGeneric): {
            readonly map: Map<Extract<keyof OptionsGeneric, string>, OptionsGeneric[Extract<keyof OptionsGeneric, string>]>;
            get size(): number;
            entries(): MapIterator<[Extract<keyof OptionsGeneric, string>, OptionsGeneric[Extract<keyof OptionsGeneric, string>]]>;
            forEach(callbackfn: (value: OptionsGeneric[Extract<keyof OptionsGeneric, string>], key: Extract<keyof OptionsGeneric, string>, map: /*elided*/ any) => void, thisArg?: unknown): void;
            get<KeyGeneric extends Extract<keyof OptionsGeneric, string>>(key: KeyGeneric): OptionsGeneric[KeyGeneric];
            has<KeyGeneric extends Extract<keyof OptionsGeneric, string>>(key: KeyGeneric): this is import("./optis/ProcessedOptionsMap.ts").ProcessedOptionsMapShape<OptionsGeneric & { [Key in KeyGeneric]-?: Exclude<OptionsGeneric[Key], undefined>; }>;
            keys(): MapIterator<Extract<keyof OptionsGeneric, string>>;
            values(): MapIterator<OptionsGeneric[Extract<keyof OptionsGeneric, string>]>;
            [Symbol.iterator](): MapIterator<[Extract<keyof OptionsGeneric, string>, OptionsGeneric[Extract<keyof OptionsGeneric, string>]]>;
        };
    };
    const RequiredOptionsError: typeof RequiredOptionsErrorValue;
}
export default optis;
export type { Dict, Parameter, Processed, ProcessedMap, Schema, Setup, TypedFactory } from './optis/types.ts';
export type { Dict as OptisDict, Parameter as OptisParameter, Processed as OptisProcessed, ProcessedMap as OptisProcessedMap, Schema as OptisSchema, Setup as OptisSetup, TypedFactory as OptisTypedFactory, } from './optis/types.ts';
export { optis, ProcessedOptionsMapValue as ProcessedOptionsMap, RequiredOptionsErrorValue as RequiredOptionsError };
