import { IQuery } from '@nestjs/cqrs'

export class FindEmployeesQuery implements IQuery {
	constructor() {}
}
