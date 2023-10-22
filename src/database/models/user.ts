import { join } from 'path'
import type { Pojo, RelationMappings } from 'objection'
import { Model } from 'objection'
import { BaseModel } from './base'

export class User extends BaseModel {
  static tableName = 'users'

  email: string
  password: string
  role: string

  protected $transformJSON = {
    omit: ['password', 'deletedAt'],
  }

  static relationMappings(): RelationMappings {
    return {
      refreshToken: {
        relation: Model.HasManyRelation,
        modelClass: join(__dirname, 'refresh-token'),
        join: {
          from: 'users.id',
          to: 'refreshToken.userId',
        },
      },
    }
  }

  //TODO: Add hashPassword
  async $beforeInsert(): Promise<void> {
    if (this.password) {
      this.password = this.password // TODO remove
      // TODO this.password = await hasPassword(this.password) // eslint-disable-line require-atomic-updates
    }
  }

  async $beforeUpdate(): Promise<void> {
    super.$beforeUpdate()

    if(this.password) {
      this.password = await this.password // TODO remove
      //this.password = await hashPassword(this.password) // eslint-disable-line require-atomic-updates
    }
  }

  $formatDatabaseJson(json: Pojo): Pojo {
    json = super.$formatDatabaseJson(json)
    return json //TODO remove
    //TODO return lowercaseObjectProperty(json, 'email')
  }

}
