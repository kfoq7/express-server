const handleError = error => {
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

export const handleReponseError = (res, error) => {
  const responseError = handleError(error)

  console.error(error)

  res.status(responseError.status).json({
    ...responseError,
  })
}
