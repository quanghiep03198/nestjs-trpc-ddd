import { IQuery } from '@nestjs/cqrs'

export class GetUserProfile implements IQuery {
	constructor(public readonly email: string) {}
}
