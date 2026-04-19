import {test} from 'bun:test'

test('TypeScript fixtures compile', async () => {
  const child = Bun.spawn(['bun', 'x', 'tsc', '--project', 'tsconfig.json', '--pretty', 'false'], {
    cwd: process.cwd(),
    stderr: 'pipe',
    stdout: 'pipe',
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ])
  if (exitCode !== 0) {
    throw new Error([stdout.trim(), stderr.trim()].filter(Boolean).join('\n'))
  }
})
