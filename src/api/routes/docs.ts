import Router from 'koa-router'
import { handleErrors, handleNotFound } from '../middleware/errors'
import { Context } from 'koa'
import yamljs from 'yamljs'
import { koaSwagger } from 'koa2-swagger-ui'

const router = new Router<{}, Context> ({ prefix: '/docs' })
const spec = yamljs.load(process.cwd() + '/docs/openapi.yaml');

router.use(handleErrors)
router.use(koaSwagger({ swaggerOptions: { spec } }));

router.get('/', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }))

router.use(handleNotFound)

export const docsRoutes = router.routes()