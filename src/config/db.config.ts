import { ConfigService } from '@nestjs/config'
import { SequelizeModuleOptions } from '@nestjs/sequelize'

export function getSequelizeConfig(
	configService: ConfigService
): SequelizeModuleOptions {
	const host = configService.get<string>('DB_HOST', '127.0.0.1')
	const port = configService.get<number>('DB_PORT', 5432)
	const database = configService.get<string>('DB_DATABASE')
	const username = configService.get<string>('DB_USERNAME')
	const password = configService.get<string>('DB_PASSWORD')

	console.log({ host, port, database, username, password }) // лог для отладки

	if (!database || !username || !password) {
		throw new Error(
			'Не заданы переменные DB_DATABASE, DB_USERNAME или DB_PASSWORD'
		)
	}

	return {
		dialect: 'postgres',
		host, // используем локальную переменную
		port,
		database,
		username,
		password,
		autoLoadModels: true,
		synchronize: true,
		sync: { force: true }, // для сброса данных в БД
		dialectOptions: { connectTimeout: 5000 }, // 5 сек таймаут
		retryAttempts: 1,
		retryDelay: 2000,
		logging: false
	}
}
