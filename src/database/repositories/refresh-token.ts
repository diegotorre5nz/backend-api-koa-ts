import {
  MaybeSingleQueryBuilder,
  Page,
  QueryBuilder,
  QueryBuilderType,
  Transaction,
} from 'objection'
import { RefreshToken } from '../models/refresh-token'
import type { OrderOptions, PaginationOptions } from './base'
import { BaseRepository } from './base'

export interface UserOrderOptions extends OrderOptions {
  column: 'id' | string 
}

export interface FilterOptions {
  order: UserOrderOptions
  pagination: PaginationOptions
} 

export interface PaginatedusersList {
  total: number
  results: RefreshToken[]
}

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor(transaction?: Transaction) {
    super(RefreshToken, transaction)
  }

  findByToken (userId: number, ip_address: string, token: string): MaybeSingleQueryBuilder<QueryBuilderType<RefreshToken>> {
    return this.findOneBy({ userId, ip_address, token})
  }

  findValidTokenAndUserByToken (token: string): MaybeSingleQueryBuilder<QueryBuilderType<RefreshToken>>{
    return this.query().findOne({ token })
    .withGraphJoined('[user]')
    .whereRaw('"user"."deleted_at" IS NULL AND "user"."deleted_at" IS NULL AND "user"."deleted_at" IS NULL')
  }

  findValidTokenAndUserByTokenAndUser (token: string, userId: number): MaybeSingleQueryBuilder<QueryBuilderType<RefreshToken>>{
    return this.query().findOne({ token, userId })
    .withGraphJoined('[user]')
    .whereRaw('"user"."deleted_at" IS NULL AND "user"."deleted_at" IS NULL AND "user"."deleted_at" IS NULL')
  }

  findforAdmin(options: FilterOptions) : QueryBuilder<RefreshToken, Page<RefreshToken>> {
    const { order, pagination } = options

    return this.findAll()
      .skipUndefined()
      .orderBy(order.column, order.direcction)
      .page(pagination.page, pagination.pageSize)
  }
}

export const refreshTokenRepository = new RefreshTokenRepository()
