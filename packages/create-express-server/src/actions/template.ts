import type { Context } from './context.js'

import fs from 'node:fs'
import path from 'node:path'
import { downloadTemplate } from '@bluwy/giget-core'

export async function template(ctx: Pick<Context, 'template'>) {
  if (!ctx.template) ctx.template = 'express-server-ts'

  await copyTemplate(ctx.template!, ctx as Context)
}

export function getTemplateTarget(tmpl: string) {
  return `github:kfoq7/express-server/templates/${tmpl}`
}

const FILES_TO_UPDATE = {
  'package.json': (file: string, overrides: { name: string }) =>
    fs.promises.readFile(file, 'utf-8').then(value => {
      const indent = /(^\s+)/m.exec(value)?.[1] ?? '\t'
      return fs.promises.writeFile(
        file,
        JSON.stringify(
          Object.assign(JSON.parse(value), Object.assign(overrides, { private: undefined })),
          null,
          indent,
        ),
        'utf-8',
      )
    }),
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

  const updateFiles = Object.entries(FILES_TO_UPDATE).map(async ([file, update]) => {
    const fileLoc = path.resolve(path.join(ctx.cwd, file))
    if (fs.existsSync(fileLoc)) {
      return update(fileLoc, { name: ctx.projectName! })
    }
  })

  await Promise.all([...updateFiles])
}
