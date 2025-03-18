import arg from 'arg'

export interface Context {
  help: boolean
  cwd: string
  packageManager: string
  projectName: string
  template?: string
  exit(code: number): never
}

export async function getContext(argv: string[]) {
  const flags = arg(
    {
      '--help': Boolean,
      '--template': String,
    },
    { argv, permissive: true },
  )

  const packageManager = detectPackageManager() ?? 'npm'
  let cwd = flags['_'][0]
  const { '--help': help = false, '--template': template } = flags
  let projectName = cwd

  const context: Context = {
    help,
    packageManager,
    cwd,
    projectName,
    template,
    exit(code) {
      process.exit(code)
    },
  }

  return context
}

function detectPackageManager() {
  if (!process.env.npm_config_user_agent) return
  const specifier = process.env.npm_config_user_agent.split(' ')[0]
  const name = specifier.substring(0, specifier.lastIndexOf('/'))
  return name === 'npminstall' ? 'cnpm' : name
}
