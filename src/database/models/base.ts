import { Model } from '../init'

export class BaseModel extends Model {
  id: number
  updatedAt: Date 
  createdAt: Date
  deletedAt: Date

  async $beforeInsert(): Promise<void> {
    this.updatedAt = new Date()
    this.createdAt = new Date()
  }

  async $beforeUpdate(): Promise<void> {
    this.updatedAt = new Date()
  }

}
