import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
	console.log('> BOOTSTRAP: старт')
	const app = await NestFactory.create(AppModule)
	console.log('> BOOTSTRAP: создан app')

	// Устанавливаем глобальный префикс для всех маршрутов
	app.setGlobalPrefix('api')

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // убирает лишние поля
			forbidNonWhitelisted: true, // бросает ошибку при лишних полях
			transform: true // автоматически приводит типы
		})
	)
	console.log('> BOOTSTRAP: перед listen')
	await app.listen(4000)
	console.log('> BOOTSTRAP: после listen')
}

bootstrap()
