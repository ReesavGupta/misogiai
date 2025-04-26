export class ApiError extends Error {
  statusCode: number
  message: string
  erros: any[]
  stack?: string | undefined

  constructor(
    statusCode: number,
    message: string,
    erros: any[] = [],
    stack?: string
  ) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    this.erros = erros

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
