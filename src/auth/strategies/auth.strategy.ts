import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { UserModel } from '../user.model'
import { InjectModel } from '@nestjs/sequelize'
import { ExtractJwt, Strategy } from 'passport-jwt'

/**
 * JWT-стратегия для аутентификации на основе токена.
 * Проверяет валидность токена и загружает пользователя из БД.
 */
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		@InjectModel(UserModel)
		private readonly userModel: typeof UserModel
	) {
		// @ts-ignore
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлекает токен из заголовка Bearer
			ignoreExpiration: false, // Учитывает истечение срока действия токена
			secretOrKey: configService.get<string>('JWT_SECRET') // Ключ для проверки подписи токена
		})
	}

	/**
	 * Метод валидации пользователя по данным из токена.
	 * Находит пользователя в БД по его ID.
	 *
	 * @param payload - данные, содержащиеся в токене (например, { id: 123 })
	 * @returns Объект пользователя или null, если не найден
	 */
	async validate(payload: { id: number }): Promise<UserModel | null> {
		return this.userModel.findByPk(payload.id)
	}
}
