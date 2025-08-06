import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UserModel } from './user.model'
import { JwtService } from '@nestjs/jwt'
import { AuthDto } from './dto/auth.dto'
import { compare, genSalt, hash } from 'bcryptjs'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel)
		private readonly userModel: typeof UserModel,
		private readonly jwtService: JwtService
	) {}

	/**
	 * Авторизация пользователя.
	 * Проверяет данные, возвращает пользователя и токен доступа.
	 */
	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		return {
			user: this.returnUserFields(user),
			accessToken: await this.issueAccessToken(user.id)
		}
	}

	/**
	 * Регистрация нового пользователя.
	 * Создаёт запись в БД и возвращает пользователя и токен.
	 */
	async register(dto: AuthDto) {
		const oldUser = await this.userModel.findOne({
			where: { email: dto.email }
		})

		if (oldUser) throw new BadRequestException('Некорректные email или пароль')

		const salt = await genSalt(10)

		const user = await this.userModel.create({
			email: dto.email,
			name: dto.name ? dto.name : '',
			password: await hash(dto.password, salt)
		})

		return {
			user: this.returnUserFields(user),
			accessToken: await this.issueAccessToken(user.id)
		}
	}

	/**
	 * Проверяет существование пользователя и корректность пароля.
	 * Возвращает пользователя при успешной проверке.
	 */
	async validateUser(dto: AuthDto) {
		const user = await this.userModel.findOne({
			where: { email: dto.email },
			attributes: ['id', 'email', 'password', 'name']
		})

		if (!user) throw new UnauthorizedException('Пользователь не найден')

		const isValidPassword = await compare(dto.password, user.get().password)

		if (!isValidPassword)
			throw new UnauthorizedException('Некорректные email или пароль')

		return user
	}

	/**
	 * Генерирует JWT-токен для указанного пользователя.
	 */
	async issueAccessToken(userId: string) {
		const data = { id: userId }

		return await this.jwtService.signAsync(data, {
			expiresIn: '31d'
		})
	}

	/**
	 * Возвращает только нужные поля пользователя (без пароля).
	 */
	returnUserFields(user: UserModel) {
		const userData = user.get({ plain: true })
		return {
			id: userData.id,
			name: userData.name,
			email: userData.email
		}
	}
}
