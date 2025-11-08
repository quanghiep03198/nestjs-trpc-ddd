import { GetIsUserExistHandler } from './get-user-exist/get-exist-user.handler'
import { GetUserProfileHandler } from './get-user-profile/get-user-profile.handler'
import { GetUsersHandler } from './get-users/get-users.handler'

export const UserQueryHandlers = [GetUsersHandler, GetUserProfileHandler, GetIsUserExistHandler]
