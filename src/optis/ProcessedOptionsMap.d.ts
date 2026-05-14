export interface ProcessedOptionsMapShape<OptionsGeneric extends Record<string, unknown> = Record<string, unknown>> {
    get: <KeyGeneric extends KeyOf<OptionsGeneric>>(key: KeyGeneric) => OptionsGeneric[KeyGeneric];
    has: <KeyGeneric extends KeyOf<OptionsGeneric>>(key: KeyGeneric) => this is ProcessedOptionsMapShape<OptionsGeneric & {
        [Key in KeyGeneric]-?: Exclude<OptionsGeneric[Key], undefined>;
    }>;
    readonly size: number;
}
export type ProcessedOptionsMap<OptionsGeneric extends Record<string, unknown> = Record<string, unknown>> = ProcessedOptionsMapShape<OptionsGeneric>;
type KeyOf<OptionsGeneric extends Record<string, unknown>> = Extract<keyof OptionsGeneric, string>;
declare class ProcessedOptionsMapRuntime<OptionsGeneric extends Record<string, unknown> = Record<string, unknown>> implements ProcessedOptionsMapShape<OptionsGeneric> {
    readonly map: Map<KeyOf<OptionsGeneric>, OptionsGeneric[KeyOf<OptionsGeneric>]>;
    constructor(options?: OptionsGeneric);
    get size(): number;
    entries(): MapIterator<[Extract<keyof OptionsGeneric, string>, OptionsGeneric[Extract<keyof OptionsGeneric, string>]]>;
    forEach(callbackfn: (value: OptionsGeneric[KeyOf<OptionsGeneric>], key: KeyOf<OptionsGeneric>, map: this) => void, thisArg?: unknown): void;
    get<KeyGeneric extends KeyOf<OptionsGeneric>>(key: KeyGeneric): OptionsGeneric[KeyGeneric];
    has<KeyGeneric extends KeyOf<OptionsGeneric>>(key: KeyGeneric): this is ProcessedOptionsMapShape<OptionsGeneric & {
        [Key in KeyGeneric]-?: Exclude<OptionsGeneric[Key], undefined>;
    }>;
    keys(): MapIterator<Extract<keyof OptionsGeneric, string>>;
    [Symbol.iterator](): MapIterator<[Extract<keyof OptionsGeneric, string>, OptionsGeneric[Extract<keyof OptionsGeneric, string>]]>;
    values(): MapIterator<OptionsGeneric[Extract<keyof OptionsGeneric, string>]>;
}
export declare const ProcessedOptionsMap: typeof ProcessedOptionsMapRuntime;
export {};
