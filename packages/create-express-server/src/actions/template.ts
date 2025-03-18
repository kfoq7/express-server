import type { Context } from './context.js'

import fs from 'node:fs'
// import path from 'node:path'
import { downloadTemplate } from '@bluwy/giget-core'

export async function template(ctx: Pick<Context, 'template'>) {}

export function getTemplateTarget(tmpl: string) {
  return `github:kfoq7/express-server#templates/${tmpl}`
}

export default async function copyTemplate(tmpl: string, ctx: Context) {
  const templateTarget = getTemplateTarget(tmpl)

  try {
    await downloadTemplate(templateTarget, {
      force: true,
      cwd: ctx.cwd,
      dir: '.',
    })
  } catch (error: any) {
    // Only remove the directory if it's most likely created by us.
    if (ctx.cwd !== '.' && ctx.cwd !== './' && !ctx.cwd.startsWith('../')) {
      try {
        fs.rmdirSync(ctx.cwd)
      } catch (_) {
        // Ignore any errors from removing the directory,
        // make sure we throw and display the original error.
      }
    }

    if (error.message?.includes('404')) {
      throw new Error(`Template does not exist!`)
    }

    if (error.message) {
      console.log('error', error.message)
    }

    throw new Error('Unable to download template')
  }
}
