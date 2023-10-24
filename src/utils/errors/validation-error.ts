import AppError from './app-error'

/**
 * @apiDefine ValidationError
 * @apiError BadRequest The input request data are invalid.
 * @apiErrorExample {json} BadRequest
 *    HTTP/1.1 400 BadRequest
 *    {
 *      "type": "BAD_REQUEST",
 *      "message": "Invalid or missing request data."
 *    }
 */
export class ValidationError extends AppError {
  constructor(message?: string, errors?: string) {
    super(message ?? 'Invalid or missing request data.', 
    'BAD_REQUEST', 
    400)
    this.message = errors ?? ''
  }
}
