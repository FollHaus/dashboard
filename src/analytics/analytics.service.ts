import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { col, fn, Op } from 'sequelize'
import { SaleModel } from '../sale/sale.model'
import { ProductModel } from '../product/product.model'
import { CategoryModel } from '../category/category.model'

@Injectable()
export class AnalyticsService {
	constructor(
		@InjectModel(SaleModel)
		private readonly saleRepo: typeof SaleModel,
		@InjectModel(ProductModel)
		private readonly productRepo: typeof ProductModel
	) {}

	/**
	 * Получает общую выручку за определённый период.
	 *
	 * @param startDate - Дата начала периода (строка)
	 * @param endDate - Дата окончания периода (строка)
	 * @param categoryIds - Массив ID категорий для фильтрации
	 * @returns Промис с числом — суммарной выручкой
	 */
	async getRevenue(
		startDate?: string,
		endDate?: string,
		categoryIds?: number[]
	): Promise<number> {
		const where: any = {}
		if (startDate || endDate) {
			if (startDate && endDate) {
				where.saleDate = { [Op.between]: [startDate, endDate] }
			} else if (startDate) {
				where.saleDate = { [Op.gte]: startDate }
			} else if (endDate) {
				where.saleDate = { [Op.lte]: endDate }
			}
		}
		if (categoryIds && categoryIds.length) {
			where['$product.category_id$'] = { [Op.in]: categoryIds }
		}
		const revenue = await this.saleRepo.sum('totalPrice', {
			where,
			// @ts-ignore
			include:
				categoryIds && categoryIds.length
					? [{ model: ProductModel, attributes: [] }]
					: undefined
		})
		return parseFloat(String(revenue)) || 0
	}

	/**
	 * Получает данные о продажах по категориям за определённый период.
	 *
	 * @param startDate - Дата начала периода (строка)
	 * @param endDate - Дата окончания периода (строка)
	 * @param categoryIds - Массив ID категорий для фильтрации
	 * @returns Промис с массивом объектов данных о продажах по категориям
	 */
	async getSalesByCategories(
		startDate?: string,
		endDate?: string,
		categoryIds?: number[]
	): Promise<any[]> {
		const whereSales: any = {}
		if (startDate || endDate) {
			if (startDate && endDate) {
				whereSales.saleDate = { [Op.between]: [startDate, endDate] }
			} else if (startDate) {
				whereSales.saleDate = { [Op.gte]: startDate }
			} else if (endDate) {
				whereSales.saleDate = { [Op.lte]: endDate }
			}
		}

		const includeProduct: any = {
			model: ProductModel,
			attributes: [],
			include: [{ model: CategoryModel, attributes: [] }]
		}
		if (categoryIds && categoryIds.length) {
			includeProduct.where = { categoryId: { [Op.in]: categoryIds } }
		}

		const rows = await this.saleRepo.findAll({
			attributes: [
				[col('product->category.id'), 'categoryId'],
				[col('product->category.name'), 'categoryName'],
				[fn('SUM', col('quantity_sold')), 'totalUnits'],
				[fn('SUM', col('total_price')), 'totalRevenue']
			],
			where: whereSales,
			include: [includeProduct],
			group: [
				'product.category_id',
				'product->category.id',
				'product->category.name'
			],
			raw: true
		})
		return rows
	}

	/**
	 * Получает список товаров с низким уровнем запасов.
	 *
	 * @param threshold - Пороговое значение количества товара (по умолчанию 10)
	 * @param categoryIds - Массив ID категорий для фильтрации
	 * @returns Промис с массивом объектов ProductModel
	 */
	async getLowStockProducts(
		threshold = 10,
		categoryIds?: number[]
	): Promise<ProductModel[]> {
		const where: any = { remains: { [Op.lte]: threshold } }
		if (categoryIds && categoryIds.length) {
			where.categoryId = { [Op.in]: categoryIds }
		}
		return this.productRepo.findAll({ where, include: ['category'] })
	}
}
