import { readdirSync } from 'node:fs'
import { Router } from 'express'

const ROUTER_PATH = `${__dirname}`

const router = Router()

const clearFilename = (filename: string) => filename.split('.').shift()

readdirSync(ROUTER_PATH).forEach(filename => {
  const cleanFilename = clearFilename(filename)
  if (cleanFilename !== 'index') {
    import(`./${cleanFilename}.router.ts`).then(routerModule => {
      router.use(`/${cleanFilename}`, routerModule.router)
    })
  }
})

export { router }
