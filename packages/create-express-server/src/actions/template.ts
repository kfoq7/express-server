import type { Context } from './context.js'

import fs from 'node:fs'
import { downloadTemplate } from '@bluwy/giget-core'

export async function template(ctx: Pick<Context, 'template'>) {
  if (!ctx.template) ctx.template = 'express-server-ts'

  await copyTemplate(ctx.template!, ctx as Context)
}

export function getTemplateTarget(tmpl: string) {
  return `github:kfoq7/express-server/templates/${tmpl}`
}

export default async function copyTemplate(tmpl: string, ctx: Context) {
  const templateTarget = getTemplateTarget(tmpl)

  try {
    const result = await downloadTemplate(templateTarget, {
      force: true,
      cwd: ctx.cwd,
      dir: '.',
    })
    console.log(result)
  } catch (error: any) {
    console.log(error)
    try {
      fs.rmdirSync(ctx.cwd)
    } catch (_) {
      // Ignore any errors from removing the directory,
      // make sure we throw and display the original error.
      //
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
