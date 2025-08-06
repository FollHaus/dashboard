import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

/**
 * Функция `getJWTConfig` возвращает конфигурацию для модуля JWT.
 * Использует секретный ключ из переменной окружения `JWT_SECRET`.
 */
export const getJWTConfig = async (
	configService: ConfigService
): Promise<JwtModuleOptions> => ({
	secret: await configService.get('JWT_SECRET') // Получаем секретный ключ из конфига
})
