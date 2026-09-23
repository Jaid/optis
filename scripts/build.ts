import * as path from 'forward-slash-path'

type RootPackageJson = {
  author?: Record<string, unknown> | string
  bugs?: {url?: string} | string
  dependencies?: Record<string, string>
  description?: string
  engines?: Record<string, string>
  funding?: Record<string, unknown> | string
  homepage?: string
  keywords?: Array<string>
  license?: string
  name: string
  optionalDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  repository?: {type?: string
    url?: string} | string
  version: string
}

const buildMode = Bun.env.NODE_ENV === 'production' ? 'production' : 'development'
const outputFolder = `dist/optis/${buildMode}`
const relativeTypeScriptImportPattern = /(["'])(\.{1,2}\/[^"']+)\.ts\1/gu
const normalizeRepositoryUrl = (repository: RootPackageJson['repository']) => {
  const repositoryUrl = typeof repository === 'string' ? repository : repository?.url
  if (!repositoryUrl) {
    return
  }
  if (repositoryUrl.startsWith('github:')) {
    return `https://github.com/${repositoryUrl.slice('github:'.length)}`
  }
  if (repositoryUrl.startsWith('git@github.com:')) {
    return `https://github.com/${repositoryUrl.slice('git@github.com:'.length).replace(/\.git$/u, '')}`
  }
  return repositoryUrl.replace(/^git\+/u, '').replace(/\.git$/u, '')
}
const ensureBuildSucceeded = (result: Awaited<ReturnType<typeof Bun.build>>) => {
  if (result.success) {
    return
  }
  const message = result.logs.map(log => log.message).filter(Boolean).join('\n') || 'Bun build failed.'
  throw new Error(message)
}
const writeRuntimeBundle = async () => {
  const result = await Bun.build({
    entrypoints: ['src/main.ts'],
    format: 'esm',
    minify: buildMode === 'production',
    packages: 'external',
    target: 'node',
  })
  ensureBuildSucceeded(result)
  for (const artifact of result.outputs) {
    const relativePath = artifact.path.replace(/^\.[/\\]/u, '')
    const outputFile = `${outputFolder}/${relativePath}`
    await Bun.$`mkdir -p ${path.dirname(outputFile)}`
    await Bun.write(outputFile, artifact)
  }
}
const writeDeclarations = async () => {
  await Bun.$`bun x tsc --project tsconfig.build.json --outDir ${outputFolder}`
}
const rewriteDeclarationImports = async () => {
  const glob = new Bun.Glob('**/*.d.ts')
  for await (const relativePath of glob.scan({
    cwd: outputFolder,
    onlyFiles: true,
  })) {
    const outputFile = `${outputFolder}/${relativePath}`
    const content = await Bun.file(outputFile).text()
    const rewritten = content.replaceAll(relativeTypeScriptImportPattern, '$1$2.js$1')
    if (rewritten !== content) {
      await Bun.write(outputFile, rewritten)
    }
  }
}
const writePackageJson = async () => {
  const rootPackage = await Bun.file('package.json').json() as RootPackageJson
  const repositoryUrl = normalizeRepositoryUrl(rootPackage.repository)
  const homepage = rootPackage.homepage || (repositoryUrl ? `${repositoryUrl}#readme` : undefined)
  const bugs = rootPackage.bugs || (repositoryUrl ? {url: `${repositoryUrl}/issues`} : undefined)
  const outputPackage: Record<string, unknown> = {
    name: rootPackage.name,
    version: rootPackage.version,
    type: 'module',
    types: './main.d.ts',
    exports: {
      '.': {
        types: './main.d.ts',
        import: './main.js',
        default: './main.js',
      },
    },
  }
  if (rootPackage.description) {
    outputPackage.description = rootPackage.description
  }
  if (rootPackage.keywords) {
    outputPackage.keywords = rootPackage.keywords
  }
  if (rootPackage.author) {
    outputPackage.author = rootPackage.author
  }
  if (rootPackage.funding) {
    outputPackage.funding = rootPackage.funding
  }
  if (rootPackage.repository) {
    outputPackage.repository = rootPackage.repository
  }
  if (homepage) {
    outputPackage.homepage = homepage
  }
  if (bugs) {
    outputPackage.bugs = bugs
  }
  if (rootPackage.license) {
    outputPackage.license = rootPackage.license
  }
  if (rootPackage.dependencies) {
    outputPackage.dependencies = rootPackage.dependencies
  }
  if (rootPackage.optionalDependencies) {
    outputPackage.optionalDependencies = rootPackage.optionalDependencies
  }
  if (rootPackage.peerDependencies) {
    outputPackage.peerDependencies = rootPackage.peerDependencies
  }
  if (rootPackage.engines) {
    outputPackage.engines = rootPackage.engines
  }
  await Bun.write(`${outputFolder}/package.json`, `${JSON.stringify(outputPackage, null, 2)}\n`)
}
await Bun.$`rm -rf ${outputFolder}`
await Bun.$`mkdir -p ${outputFolder}`
await writeRuntimeBundle()
await writeDeclarations()
await rewriteDeclarationImports()
await writePackageJson()
await Bun.write(`${outputFolder}/README.md`, await Bun.file('readme.md').text())
console.log(`Built ${outputFolder}`)
