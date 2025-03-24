import { getContext } from './actions/context.js'

import { projectName } from './actions/project-name.js'
import { template } from './actions/template.js'

const exit = () => process.exit(0)
process.on('SIGINT', exit)
process.on('SIGTERM', exit)

export async function main() {
  console.log('')

  const cleanArgv = process.argv.slice(2).filter(arg => arg !== '--')
  const ctx = await getContext(cleanArgv)

  const setps = [projectName, template]

  for (const step of setps) {
    await step(ctx)
  }

  process.exit(0)
}
