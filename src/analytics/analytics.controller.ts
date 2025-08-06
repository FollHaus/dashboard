import { Controller, Get, Query } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { ProductModel } from '../product/product.model'

// Функция для парсинга строковых категорий в массив чисел
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

	/**
	 * Получает общую выручку за определённый период.
	 *
	 * @param startDate - Дата начала периода (строка)
	 * @param endDate - Дата окончания периода (строка)
	 * @param categories - Строка с ID категорий через запятую
	 * @returns Промис с числом — суммарной выручкой
	 */
	@Get('revenue')
	getRevenue(
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string,
		@Query('categories') categories?: string
	): Promise<number> {
		const ids = parseCategories(categories)
		return this.analyticsService.getRevenue(startDate, endDate, ids)
	}

	/**
	 * Получает данные о продажах по категориям за определённый период.
	 *
	 * @param startDate - Дата начала периода (строка)
	 * @param endDate - Дата окончания периода (строка)
	 * @param categories - Строка с ID категорий через запятую
	 * @returns Промис с массивом данных о продажах
	 */
	@Get('category-sales')
	getCategorySales(
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string,
		@Query('categories') categories?: string
	): Promise<any[]> {
		const ids = parseCategories(categories)
		return this.analyticsService.getSalesByCategories(startDate, endDate, ids)
	}

	/**
	 * Получает список товаров с низким уровнем запасов.
	 *
	 * @param threshold - Пороговое значение количества товара (по умолчанию 10)
	 * @param categories - Строка с ID категорий через запятую
	 * @returns Промис с массивом объектов ProductModel
	 */
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
