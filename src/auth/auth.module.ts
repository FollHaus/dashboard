import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserModel } from './user.model'
import { JWTStrategy } from './strategies/auth.strategy'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getJWTConfig } from '../config/jwt.config'

/**
 * Модуль аутентификации.
 * Объединяет сервисы, контроллеры, модели и настройки JWT.
 */
@Module({
	imports: [
		// Регистрируем модель User для использования в сервисе
		SequelizeModule.forFeature([UserModel]),

		// Подключаем модуль конфигурации (для доступа к переменным окружения)
		ConfigModule,

		// Регистрируем JWT модуль с асинхронной настройкой через useFactory
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig
		})
	],
	// Контроллеры, обрабатывающие HTTP-запросы
	controllers: [AuthController],

	// Сервисы и стратегии, используемые внутри модуля
	providers: [
		AuthService, // Логика аутентификации и регистрации
		JWTStrategy // JWT-стратегия для проверки токенов
	]
})
export class AuthModule {}
