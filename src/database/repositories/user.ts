import {
  MaybeSingleQueryBuilder,
  Page,
  QueryBuilder,
  QueryBuilderType,
  Transaction,
} from 'objection'
import { User } from '../models/user'
import type { OrderOptions, PaginationOptions } from './base'
import { BaseRepository } from './base'

export interface UserOrderOptions extends OrderOptions {
  column: 'id' | 'createdAt' | 'email' | string 
}

export interface FilterOptions {
  order: UserOrderOptions
  pagination: PaginationOptions
} 

export interface PaginatedusersList {
  total: number
  results: User[]
}

export class UserRepository extends BaseRepository<User> {
  constructor(transaction?: Transaction) {
    super(User, transaction)
  }

  findByEmail (email: string): MaybeSingleQueryBuilder<QueryBuilderType<User>> {
    return this.findOneBy({ email })
  }

  findforAdmin(options: FilterOptions) : QueryBuilder<User, Page<User>> {
    const { order, pagination } = options

    return this.findAll()
      .skipUndefined()
      .orderBy(order.column, order.direcction)
      .page(pagination.page, pagination.pageSize)
  }
}

export const userRepository = new UserRepository()
