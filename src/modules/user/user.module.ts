import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './domain/services/user.service'
import { UserEntity } from './infrastructure/entities/user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity], DATA_SOURCE_SYSCLOUD)],
	providers: [UserService]
})
export class UserModule {}
