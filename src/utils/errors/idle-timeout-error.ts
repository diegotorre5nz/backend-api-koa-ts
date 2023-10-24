import AppError from './app-error'

/**
 * @apiDefine IdleTimeoutError
 * @apiError IdleTimeout Server denied access to requested resource.
 * @apiErrorExample {json} IdleTimeout
 *    HTTP/1.1 401 IdleTimeout
 *    {
 *      "type": "IDLE_TIMEOUT",
 *      "message": "Site access denied."
 *    }
 */
export class IdleTimeoutError extends AppError {
  constructor(message?: string) {
    super(message ?? 'Site access denied.',
    'IDLE_TIMEOUT',
    401)
  }
}
