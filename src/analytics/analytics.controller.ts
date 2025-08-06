import { Controller, Get, Query } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { ProductModel } from '../product/product.model'

function parseCategories(value?: string): number[] | undefined {
	if (!value) return undefined
	return value
		.split(',')
		.map((id) => parseInt(id, 10))
		.filter((n) => !isNaN(n))
}

@Controller('analytics')
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) {}

	@Get('revenue')
	getRevenue(
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string,
		@Query('categories') categories?: string
	): Promise<number> {
		const ids = parseCategories(categories)
		return this.analyticsService.getRevenue(startDate, endDate, ids)
	}

	@Get('category-sales')
	getCategorySales(
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string,
		@Query('categories') categories?: string
	): Promise<any[]> {
		const ids = parseCategories(categories)
		return this.analyticsService.getSalesByCategories(startDate, endDate, ids)
	}

	@Get('low-stock')
	getLowStock(
		@Query('threshold') threshold = '10',
		@Query('categories') categories?: string
	): Promise<ProductModel[]> {
		const ids = parseCategories(categories)
		const thr = parseInt(threshold, 10)
		return this.analyticsService.getLowStockProducts(thr, ids)
	}
}
