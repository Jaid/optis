import {test} from 'bun:test'
import * as path from 'forward-slash-path'

const runCommand = async (command: ReadonlyArray<string>, cwd: string) => {
  const child = Bun.spawn([...command], {
    cwd,
    stderr: 'pipe',
    stdout: 'pipe',
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ])
  if (exitCode !== 0) {
    throw new Error([`Command failed: ${command.join(' ')}`, stdout.trim(), stderr.trim()].filter(Boolean).join('\n'))
  }
}
const copyFolder = async (sourceFolder: string, outputFolder: string) => {
  await Bun.$`mkdir -p ${outputFolder}`
  const glob = new Bun.Glob('**/*')
  for await (const relativePath of glob.scan({
    cwd: sourceFolder,
    dot: true,
    onlyFiles: true,
  })) {
    const sourceFile = path.join(sourceFolder, relativePath)
    const outputFile = path.join(outputFolder, relativePath)
    await Bun.$`mkdir -p ${path.dirname(outputFile)}`
    await Bun.write(outputFile, Bun.file(sourceFile))
  }
}
test('Published package type helpers compile in consumer projects', async () => {
  const workspaceFolder = process.cwd()
  const temporaryRoot = Bun.env.TEMP || Bun.env.TMP || Bun.env.TMPDIR || path.resolve('private/agent')
  const consumerFolder = path.join(temporaryRoot, `optis-distribution-${crypto.randomUUID()}`)
  const nodeModulesFolder = path.join(consumerFolder, 'node_modules')
  const packageFolder = path.join(nodeModulesFolder, 'optis')
  const entryFile = path.join(consumerFolder, 'index.ts')
  await runCommand(['bun', 'run', 'build:production'], workspaceFolder)
  try {
    await Bun.$`rm -rf ${consumerFolder}`
    await Bun.$`mkdir -p ${nodeModulesFolder}`
    await copyFolder('dist/optis/production', packageFolder)
    await Bun.write(entryFile, await Bun.file('test/typecheck.distribution.examples.ts').text())
    for (const [moduleResolution, module] of [['bundler', 'esnext'], ['nodenext', 'nodenext']] as const) {
      await runCommand([
        'bun',
        'x',
        'tsc',
        '--ignoreConfig',
        '--noEmit',
        '--pretty',
        'false',
        entryFile,
        '--lib',
        'esnext',
        '--module',
        module,
        '--moduleResolution',
        moduleResolution,
        '--strict',
        '--target',
        'esnext',
      ], workspaceFolder)
    }
  } finally {
    await Bun.$`rm -rf ${consumerFolder}`
  }
})
