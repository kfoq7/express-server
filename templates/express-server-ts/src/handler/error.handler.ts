import { Response } from 'express'

interface ErrorReponse {
  status: number
  error: string
}

const handleError = (error: unknown): ErrorReponse => {
  if (error instanceof Error) {
    return {
      status: 400,
      error: error.message,
    }
  }

  return {
    status: 500,
    error: 'Internal server error',
  }
}

export const handleReponseError = (res: Response, error: unknown) => {
  const responseError = handleError(error)

  console.error(error)

  res.status(responseError.status).json({
    ...responseError,
  })
}
