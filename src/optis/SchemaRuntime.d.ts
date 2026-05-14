import type { Dict, Schema, Setup } from './types.ts';
type RuntimeState = Readonly<{
    defaults: Readonly<Dict>;
    normalizations: Readonly<Record<string, (value: unknown) => unknown>>;
    requiredKeys: ReadonlyArray<string>;
}>;
export declare const toRuntimeState: (input?: Dict) => RuntimeState;
export declare function createSchema<SetupGeneric extends Setup = {}>(state?: RuntimeState): Schema<SetupGeneric>;
export declare const attachSchemaBehavior: <TargetGeneric extends Function>(target: TargetGeneric, state?: RuntimeState) => TargetGeneric;
export {};
