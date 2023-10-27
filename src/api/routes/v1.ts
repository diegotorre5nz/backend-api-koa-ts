import Router from 'koa-router'
import { handleErrors, handleNotFound } from '../middleware/errors'
import * as controllers from '../controllers/v1'
import { Context } from 'koa'

const router = new Router<{}, Context> ({ prefix: '/v1' })

router.use(handleErrors)
router.post('/users', controllers.user.create)
router.use(handleNotFound)

export const v1Routes = router.routes()
