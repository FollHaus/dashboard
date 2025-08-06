// src/category/category.module.ts
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CategoryModel } from './category.model'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'

@Module({
	imports: [
		SequelizeModule.forFeature([CategoryModel]) // регистрируем CategoryModel
	],
	controllers: [CategoryController],
	providers: [CategoryService],
	exports: [
		CategoryService, // если кому-то нужен сервис
		SequelizeModule // чтобы другие модули могли инжектить @InjectModel(CategoryModel)
	]
})
export class CategoryModule {}
