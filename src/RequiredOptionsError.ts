import type {Arrayable} from 'type-fest'

const castArray = <ValueGeneric>(value: Arrayable<ValueGeneric>) => {
  return Array.isArray(value) ? [...value] : [value]
}

export class RequiredOptionsError extends Error {
  static getMessage(missingKeys: Array<string>) {
    if (missingKeys.length === 1) {
      return `Missing required option: ${missingKeys[0]}`
    }
    return `Missing required options: ${missingKeys.join(', ')}`
  }

  givenKeys: Array<string>
  missingKeys: Array<string>
  requiredKeys: Array<string>

  constructor(givenKeys: Array<string>, requiredKeys: Arrayable<string>) {
    const requiredKeysArray = castArray(requiredKeys)
    const missingKeys = requiredKeysArray.filter(key => !givenKeys.includes(key))
    super(RequiredOptionsError.getMessage(missingKeys))
    this.name = 'RequiredOptionsError'
    this.givenKeys = givenKeys
    this.requiredKeys = requiredKeysArray
    this.missingKeys = missingKeys
  }
}
