import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SaleModel } from './sale.model'
import { SaleService } from './sale.service'
import { SaleController } from './sale.controller'
import { ProductModule } from '../product/product.module'

@Module({
	imports: [
		SequelizeModule.forFeature([SaleModel]), // только SaleModel
		ProductModule // чтобы получить ProductService
	],
	providers: [SaleService],
	controllers: [SaleController]
})
export class SaleModule {}
