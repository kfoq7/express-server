import type { Context } from './context.ts'

export async function projectName(ctx: Pick<Context, 'cwd'>) {
  ctx.cwd = `./${ctx.cwd}`
}
