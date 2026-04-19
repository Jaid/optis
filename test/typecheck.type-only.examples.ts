import type optis from 'optis'

type Equal<LeftGeneric, RightGeneric> = (<ValueGeneric>() => ValueGeneric extends LeftGeneric ? 1 : 2) extends (<ValueGeneric>() => ValueGeneric extends RightGeneric ? 1 : 2)
  ? (<ValueGeneric>() => ValueGeneric extends RightGeneric ? 1 : 2) extends (<ValueGeneric>() => ValueGeneric extends LeftGeneric ? 1 : 2)
    ? true
    : false
  : false

type Expect<ConditionGeneric extends true> = ConditionGeneric

type CompileTimeSchema = optis.Schema<{
  required: {
    target: string
  }
}>

type _CompileTimeParameter = Expect<Equal<optis.Parameter<CompileTimeSchema>, {target: string}>>

const compileOnly = (options: optis.Parameter<CompileTimeSchema>) => {
  const target: string = options.target
  return `Hello, ${target}!`
}
void compileOnly
