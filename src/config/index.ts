export interface Config {
  hostname: string
  env: string
  appName: string
  version: string
  time: {
    utcOffset: number
  }
  server: {
    port: number
    bodyParser: {
      patchKoa: boolean
      urlencoded: boolean
      text: boolean
      json: boolean
      multipart: boolean
    }
    cors: {
      origin: string
      exposeHeaders: string[]
      maxAge: number
    }
  }
  auth: {
    secret: string
    saltRounds: number
    accessTokenExpiration: number
    refreshTokenExpiration: number
    issuer: string
    createOptions: {
      expiresIn: number
      algorithm: string
      issuer: string
    }
    verifyOptions: {
      algorithm: string
      issuer: string
    }
  }
  logger: {
    enabled: boolean
    stdout: boolean
    minLevel: string
  }
  database: {
    client: string
    connection: string
    pool: {
      min: number
      max: number
    }
  }
  aws: {
    s3: {
      bucketName: string | undefined
    }
    rekognition: {
      minConfidence: number
    }
  }
  jobs: {
    redisUrl: string
  }
  apolloEngineApiKey: string | undefined
}

export function getEnvironmentValue(key: string, value: string): string {
  return process.env[key] ?? value
}
