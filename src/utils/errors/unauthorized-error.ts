import AppError from './app-error'

/**
 * @apiDefine UnauthorizedError
 * @apiError Unauthorized Server denied access to requested resource.
 * @apiErrorExample {json} Unauthorized
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "type": "UNAUTHORIZED",
 *      "message": "Site access denied."
 *    }
 */
export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super(message ?? 'Site access denied.',
    'UNAUTHORIZED', 
    401)
  }
}
