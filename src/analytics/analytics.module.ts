import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AnalyticsService } from './analytics.service'
import { AnalyticsController } from './analytics.controller'
import { SaleModel } from '../sale/sale.model'
import { ProductModel } from '../product/product.model'
import { CategoryModel } from '../category/category.model'

@Module({
	imports: [
		SequelizeModule.forFeature([SaleModel, ProductModel, CategoryModel])
	],
	controllers: [AnalyticsController],
	providers: [AnalyticsService]
})
export class AnalyticsModule {}
