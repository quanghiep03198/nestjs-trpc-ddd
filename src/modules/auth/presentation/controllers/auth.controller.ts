import { HttpMethod, Public, RequireAuth, Route, User } from '@/common/decorators'
import { Controller, HttpStatus, UseGuards } from '@nestjs/common'
import { LoginUseCase } from '../../application/use-cases/login.use-case'
import { LocalAuthGuard } from '../../infrastructure/guards/local.guard'

@Controller('auth')
export class AuthController {
	constructor(private readonly loginUseCase: LoginUseCase) {}

	@Public()
	@Route({ endpoint: 'login', method: HttpMethod.POST, statusCode: HttpStatus.OK })
	@UseGuards(LocalAuthGuard)
	public async login(@User() user) {
		return await this.loginUseCase.execute(user)
	}

	@Route({ endpoint: 'logout', method: HttpMethod.POST, statusCode: HttpStatus.OK })
	@RequireAuth()
	public async logout() {}

	@Route({ endpoint: 'refresh-token', method: HttpMethod.POST, statusCode: HttpStatus.OK })
	public async refreshToken() {
		// TODO: implement refresh token logic
	}

	@Public()
	public async recoverPassword() {
		// TODO: implement recover password logic
	}
}
