import { DeepPartial, DeleteResult, FindManyOptions, FindOptionsWhere, UpdateResult } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js'
import { BaseAbstractEntity } from './base.entity.abstract'
import { PaginationDto } from './dto/pagination.dto'

export interface IBaseService<Entity extends BaseAbstractEntity> {
	insertOne(payload: DeepPartial<Entity>): Promise<Entity>
	findAll(): Promise<Entity[]>
	findOneById(id: number): Promise<Entity>
	updateOneById(id: number, update: QueryDeepPartialEntity<Entity>): Promise<UpdateResult>
	softDeleteOneById(id: number): Promise<UpdateResult>
	deleteOneById(id: number): Promise<DeleteResult>
	restoreOneById(id: number): Promise<UpdateResult>
	paginate(
		filterQueries: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
		{ page, limit, ...options }: PaginationDto & Omit<FindManyOptions<Entity>, 'where'>
	)
}
