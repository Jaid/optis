type KeyList = ReadonlyArray<string> | string;
export declare class RequiredOptionsError extends Error {
    static getMessage(missingKeys: ReadonlyArray<string>): string;
    readonly givenKeys: Array<string>;
    readonly missingKeys: Array<string>;
    readonly requiredKeys: Array<string>;
    constructor(givenKeys: ReadonlyArray<string>, requiredKeys: KeyList);
}
export {};
