import { type Config } from '.'
import { getEnvironmentValue } from '.'

const config: Config = {
  hostname: 'http://localhost:3000',
  env: getEnvironmentValue('NODE_ENV', 'dev-local'),
  appName: 'backend-api-koa',
  version: '0.0.1',
  time: {
    utcOffset: -6,
  },
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
      'htfq4o3bcyriq4wdfgdyvtcbyrwfggfhdqv3fy53bprogc',
    ),
    saltRounds: 10,
    accessTokenExpiration: 60 * 60 * 1000,
    refreshTokenExpiration: 24 * 60 * 60 * 1000,
    issuer: 'com.reloaded.backend-api',
    createOptions: {
      expiresIn: 60 * 60,
      algorithm: 'HS256',
      issuer: 'com.reloaded.backend-api',
    },
    verifyOptions: {
      algorithm: 'HS256',
      issuer: 'com.reloaded.backend-api',
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
      min: Number(getEnvironmentValue('DATABASE_POOL_MIN', '0')),
      max: Number(getEnvironmentValue('DATABASE_POOL_MAX', '5')),
    },
  },
  aws: {
    s3: {
      bucketName: getEnvironmentValue('AWS_S3_BUCKET_NAME', ''),
    },
    rekognition: {
      minConfidence: 90,
    },
  },
  jobs: {
    redisUrl: getEnvironmentValue('REDIS_URL', 'redis://127.0.0.1:6379'),
  },
  apolloEngineApiKey: getEnvironmentValue('APOLLO_ENGINE_API_KEY', ''),
}

export default config
