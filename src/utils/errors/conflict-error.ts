import AppError from './app-error'

/**
 * @apiDefine ConflictError
 * @apiError Conflict The request could not be completed due to a conflict with the current state of the resource.
 * @apiErrorExample {json} Conflict
 *    HTTP/1.1 409 Conflict
 *    {
 *      "type": "CONFLICT",
 *      "message": "The request could not be completed due to a conflict with the current state of the resource."
 *    }
 */
export class ConflictError extends AppError {
  constructor(message?: string) {
    super(message ?? 'The request could not be completed due to a conflict with the current state of the resource.',
    'CONFLICT',
    409,
    )
  }
}
