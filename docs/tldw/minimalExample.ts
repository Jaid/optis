import optis from 'optis'

const schema = optis({
  defaults: {
    target: 'world',
  },
})

export default (options: optis.Parameter<typeof schema>) => {
  const processedOptions = schema.process(options)
  return `Hello, ${processedOptions.target}!`
}
