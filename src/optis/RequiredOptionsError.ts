type KeyList = ReadonlyArray<string> | string

const toKeyArray = (value: KeyList) => {
  return typeof value === 'string' ? [value] : [...value]
}

export class RequiredOptionsError extends Error {
  static getMessage(missingKeys: ReadonlyArray<string>) {
    if (missingKeys.length === 1) {
      return `Missing required option: ${missingKeys[0]}`
    }
    return `Missing required options: ${missingKeys.join(', ')}`
  }

  readonly givenKeys: Array<string>
  readonly missingKeys: Array<string>
  readonly requiredKeys: Array<string>

  constructor(givenKeys: ReadonlyArray<string>, requiredKeys: KeyList) {
    const givenKeysArray = [...givenKeys]
    const requiredKeysArray = toKeyArray(requiredKeys)
    const missingKeys = requiredKeysArray.filter(key => !givenKeysArray.includes(key))
    super(RequiredOptionsError.getMessage(missingKeys))
    this.name = 'RequiredOptionsError'
    this.givenKeys = givenKeysArray
    this.requiredKeys = requiredKeysArray
    this.missingKeys = missingKeys
  }
}
