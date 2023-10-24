import AppError from './app-error'

/**
 * @apiDefine NotFoundError
 * @apiError NotFound Requested resource not found.
 * @apiErrorExample {json} NotFound
 *    HTTP/1.1 404 NotFound
 *    {
 *      "type": "NOT_FOUND",
 *      "message": "Resource not found."
 *    }
 */
export class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message ?? 'Resource not found.',
    'NOT_FOUND',
    404,
    )
  }
}
