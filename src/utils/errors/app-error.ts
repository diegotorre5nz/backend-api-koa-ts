import logger from '../logger'

export default class AppError extends Error {
  message: string
  type: string
  status: number
  constructor(message: string, type: string, status: number) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message
    this.type = type
    this.status = status
    const stack = this.stack ? this.stack.split('\n') : this.stack
    logger.error({
      error: {
        status: this.status,
        name: this.name,
        message: this.message,
        type: this.message,
        stack: stack && stack.length > 2 ? `${stack[0]}  ${stack[1]}` : stack,
      },
    })
  }
}
