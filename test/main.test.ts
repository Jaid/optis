import {it, expect} from 'bun:test'

import {getMainModuleDefault} from 'zeug'

const optis = await getMainModuleDefault<typeof import('../src/main.ts')>('src/main.ts')

it("should run", () => {
  expect(optis).toBe(1) // TODO Test actual functionality
})
