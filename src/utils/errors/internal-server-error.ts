import AppError from './app-error'

/**
 * @apiDefine InternalServerError
 * @apiError (Error 5xx) InternalServerError Something went wrong.
 * @apiErrorExample {json} InternalServerError
 *    HTTP/1.1 500 InternalServerError
 *    {
 *      "type": "INTERNAL_SERVER",
 *      "message": "Something went wrong. Please try again later or contact support."
 *    }
 */
export class InternalServerError extends AppError {
  constructor(message?: string) {
    super(message ?? 'Something went wrong. Please try again later or contact support.',
    'INTERNAL_SERVER',
    500,
    )
  }
}
