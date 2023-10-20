import Router from 'koa-router'
import { handleErrors, handleNotFound } from '../middleware/errors'

const router = new Router()
router.use(handleErrors)
router.use(handleNotFound)

export default router.routes()
