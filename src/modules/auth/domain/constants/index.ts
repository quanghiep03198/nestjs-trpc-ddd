export const ACCESS_TOKEN_CACHE_TTL = 60 * 1000 * 60

export enum Role {
	ADMIN = 'ADMIN',
	HR_MANAGER = 'HR_MANAGER',
	EMPLOYEE = 'EMPLOYEE'
}

export enum Action {
	CREATE = 'create',
	READ = 'read',
	VIEW = 'view',
	UPDATE = 'update',
	DELETE = 'delete',
	EXPORT = 'export',
	IMPORT = 'import'
}
