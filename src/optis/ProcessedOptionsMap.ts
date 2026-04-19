export interface ProcessedOptionsMapShape<OptionsGeneric extends Record<string, unknown> = Record<string, unknown>> {
  get: <KeyGeneric extends KeyOf<OptionsGeneric>>(key: KeyGeneric) => OptionsGeneric[KeyGeneric]
  has: <KeyGeneric extends KeyOf<OptionsGeneric>>(key: KeyGeneric) => this is ProcessedOptionsMapShape<OptionsGeneric & {[Key in KeyGeneric]-?: Exclude<OptionsGeneric[Key], undefined>}>
  readonly size: number
}

export type ProcessedOptionsMap<OptionsGeneric extends Record<string, unknown> = Record<string, unknown>> = ProcessedOptionsMapShape<OptionsGeneric>

type KeyOf<OptionsGeneric extends Record<string, unknown>> = Extract<keyof OptionsGeneric, string>

type EntryOf<OptionsGeneric extends Record<string, unknown>> = [KeyOf<OptionsGeneric>, OptionsGeneric[KeyOf<OptionsGeneric>]]

class ProcessedOptionsMapRuntime<OptionsGeneric extends Record<string, unknown> = Record<string, unknown>> implements ProcessedOptionsMapShape<OptionsGeneric> {
  readonly map: Map<KeyOf<OptionsGeneric>, OptionsGeneric[KeyOf<OptionsGeneric>]>

  constructor(options: OptionsGeneric = {} as OptionsGeneric) {
    this.map = new Map(Object.entries(options) as Array<EntryOf<OptionsGeneric>>)
  }

  get size() {
    return this.map.size
  }

  entries() {
    return this.map.entries()
  }

  forEach(callbackfn: (value: OptionsGeneric[KeyOf<OptionsGeneric>], key: KeyOf<OptionsGeneric>, map: this) => void, thisArg?: unknown) {
    for (const [key, value] of this.map.entries()) {
      callbackfn.call(thisArg, value, key, this)
    }
  }

  get<KeyGeneric extends KeyOf<OptionsGeneric>>(key: KeyGeneric): OptionsGeneric[KeyGeneric] {
    return this.map.get(key) as OptionsGeneric[KeyGeneric]
  }

  has<KeyGeneric extends KeyOf<OptionsGeneric>>(key: KeyGeneric): this is ProcessedOptionsMapShape<OptionsGeneric & {[Key in KeyGeneric]-?: Exclude<OptionsGeneric[Key], undefined>}> {
    return this.map.has(key)
  }

  keys() {
    return this.map.keys()
  }

  [Symbol.iterator]() {
    return this.entries()
  }

  values() {
    return this.map.values()
  }
}

export const ProcessedOptionsMap = ProcessedOptionsMapRuntime
