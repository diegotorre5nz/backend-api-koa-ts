import { Model, type Pojo, type RelationMappings } from 'objection'
import { BaseModel } from './base'
import moment from 'moment'
import { join } from 'path'
import { hashString } from '../../utils/crypto'

export class RefreshToken extends BaseModel {
  static tableName = 'refresh_tokens'

  token: string
  issuedAt: Date
  expiresAt: Date | moment.Moment
  ipAddress: string
  userId: number

  static relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: join(__dirname, 'users'),
        join: {
          from: 'refresh_tokens.userId',
          to: 'users.id',
        },
      },
    }
  }
  
  async $beforeInsert(): Promise<void> {
    super.$beforeInsert()
    
  }

  async $beforeUpdate(): Promise<void> {
    super.$beforeUpdate()

  }

  $formatDatabaseJson(json: Pojo): Pojo {
    json = super.$formatDatabaseJson(json)
    return json //TODO remove
    //TODO return lowercaseObjectProperty(json, 'email')
  }

}