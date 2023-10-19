import { type Config } from '.'
import { getEnvironmentValue } from '.'

const config: Config = {
  hostname: 'http://localhost:3000',
  env: 'NODE_ENV',
  appName: 'backend-api-koa',
  version: '0.0.1',
  server: {
    port: Number(getEnvironmentValue('PORT', '3001')),
    bodyParser: {
      patchKoa: true,
      urlencoded: true,
      text: false,
      json: true,
      multipart: false,
    },
    cors: {
      origin: '*',
      exposeHeaders: [
        'Authorization',
        'Content-Language',
        'Content-Length',
        'Content-Type',
        'Date',
        'ETag',
      ],
      maxAge: 3600,
    },
  },
  auth: {
    secret: getEnvironmentValue(
      'AUTH_SECRET',
      'htfq4o3bcyriq4wyvtcbyrwqv3fy53bprogc',
    ),
    saltRounds: 10,
    createOptions: {
      expiresIn: 60 * 60,
      algorithm: 'HS256',
      issuer: 'com.reload.backend-api.}',
    },
    verifyOptions: {
      algorithm: 'HS256',
      issuer: 'com.reload.backend-api.}',
    },
  },
  logger: {
    enabled: true,
    stdout: true,
    minLevel: 'debug',
  },
  database: {
    client: 'pg',
    connection: getEnvironmentValue(
      'DATABASE_URL',
      'postgres://postgres:postgres@localhost:5432/backend-api-db',
    ),
    pool: {
      min: Number(process.env.DATABASE_POOL_MIN) || 0,
      max: Number(process.env.DATABASE_POOL_MAX) || 5,
    },
  },
  aws: {
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
    },
    rekognition: {
      minConfidence: 90,
    },
  },
  jobs: {
    redisUrl: getEnvironmentValue('REDIS_URL', 'redis://127.0.0.1:6379'),
  },
  apolloEngineApiKey: process.env.APOLLO_ENGINE_API_KEY,
}

export default config
