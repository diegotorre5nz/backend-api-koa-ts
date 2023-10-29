import { Model } from '../init'

export class BaseModel extends Model {
  id: number
  updatedAt: Date 
  createdAt: Date

  $beforeInsert() {
    this.updatedAt = this.createdAt = this.createdAt || new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}
