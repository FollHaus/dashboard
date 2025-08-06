import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule } from '@nestjs/config'
import { ProductModel } from './product.model'
import { CategoryModel } from '../category/category.model'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'

@Module({
	imports: [
		SequelizeModule.forFeature([ProductModel, CategoryModel]),
		ConfigModule
	],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService]
})
export class ProductModule {}
