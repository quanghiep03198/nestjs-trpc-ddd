import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { Global, Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserCommandHandlers } from './application/commands'
import { UserQueryHandlers } from './application/queries'
import { UserEntity } from './infrastructure/entities'
import { UserController } from './presentation/controllers/user.controller'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity], DATA_SOURCE_SYSCLOUD), CqrsModule],
	controllers: [UserController],
	providers: [...UserQueryHandlers, ...UserCommandHandlers],
	exports: [TypeOrmModule, ...UserQueryHandlers, ...UserCommandHandlers]
})
export class UserModule {}
