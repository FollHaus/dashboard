import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserModel } from '../user.model'

/**
 * Декоратор `@CurrentUser`, позволяет получить текущего пользователя из запроса.
 * Может возвращать весь объект пользователя или отдельное поле.
 *
 * Примеры использования:
 * - @CurrentUser() user: Получить весь объект пользователя
 * - @CurrentUser('email') email: Получить только email
 */
export const CurrentUser = createParamDecorator(
	(data: keyof UserModel, ctx: ExecutionContext) => {
		// Получаем HTTP-запрос из контекста
		const request = ctx.switchToHttp().getRequest()

		// Получаем пользователя из `request.user` (устанавливается стратегией аутентификации)
		const user = request.user

		// Если указано поле (например, 'email'), возвращаем только его
		return data ? user[data] : user
	}
)
