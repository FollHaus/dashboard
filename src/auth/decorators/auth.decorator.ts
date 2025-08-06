import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Хелпер-декоратор для защиты эндпоинтов.
 * Применяет JWT-аутентификацию через AuthGuard('jwt').
 */
export const Auth = () => UseGuards(AuthGuard('jwt'))
