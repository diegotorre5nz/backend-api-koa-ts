// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// eslint-disable-next-line import/no-unused-modules
import path from 'path'
process.env["NODE_CONFIG_DIR"] = process.cwd() + '/src/config' + path.delimiter + process.cwd() + '/src/config/env'
import 'dotenv/config'
import { type Server } from 'http'
import Koa from 'koa'
import koaBody from 'koa-body'
import koaCompress from 'koa-compress'
import koaHelmet from 'koa-helmet'
import koaCors from 'kcors'
import { v1Routes } from './routes/v1'
import { docsRoutes } from './routes/docs'
import config from 'config'
import logger from '../utils/logger'
import { connect as databaseConnect, close as databaseClose } from '../database/init'

interface Services {
  server: Server | null
}
console.log(config.get('database.connection'))
const app = new Koa()

const server: Server | null = null

const services: Services = {
  server,
}

app.use(koaHelmet())
app.use(koaCompress())
app.use(koaCors())
app.use(koaBody())
app.use(docsRoutes)
app.use(v1Routes)

app.context.ok = function(body: Object): void {
  this.status = 200
  this.body = body
}

app.context.created = function(body: Object): void {
  this.status = 201
  this.body = body
}

app.context.acepted = function(body: Object): void {
  this.status = 202
  this.body = body
}

// Define start method
async function start(): Promise<void> {
  // Start any services here:
  // e.g. database connection.
  await databaseConnect()

  logger.info('✅ Starting app…')
  services.server = app
    .listen(config.get('server.port'))
}

// Define app shutdown
function stop(): void {
  logger.info('==>  🛑 Stopping app…')

  // Stop everything now.
  // e.g. close database connection
  if (services.server) {
    databaseClose()
    services.server.close()
  }
  logger.info('==> 👋 Stopped app…')
}

// Error handling
app.on('error', (err, ctx) => {
  logger.error('server error', err, ctx)
})

// Start app
if (require.main === module) {
  start()
  logger.info(`==> 🌎 Server listening on port ${String(config.get('server.port'))}`)
}

process.once('SIGINT', () => stop())
process.once('SIGTERM', () => stop())

module.exports = app
