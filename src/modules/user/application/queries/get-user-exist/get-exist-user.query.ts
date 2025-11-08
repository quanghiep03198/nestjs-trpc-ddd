import { IQuery } from '@nestjs/cqrs'

export class GetIsUserExistQuery implements IQuery {
	constructor(public readonly id: number) {}
}
