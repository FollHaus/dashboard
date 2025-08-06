import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'
import { Sequelize, Transaction } from 'sequelize'
import { SaleModel } from './sale.model'
import { ProductService } from '../product/product.service'
import { UpdateSaleDto } from './dto/update.sale.dto'
import { CreateSaleDto } from './dto/sale.dto'

@Injectable()
export class SaleService {
	constructor(
		@InjectModel(SaleModel)
		private readonly saleRepo: typeof SaleModel,
		@InjectConnection()
		private readonly sequelize: Sequelize,
		private readonly productService: ProductService
	) {}

	/**
	 * Этапы создания продажи:
	 * 1) Начать транзакцию.
	 * 2) Уменьшить remains с передачей trx.
	 * 3) Подгрузить продукт, вычислить totalPrice.
	 * 4) Создать запись в БД.
	 */
	async createSale(dto: CreateSaleDto): Promise<SaleModel> {
		return this.sequelize.transaction(async (trx: Transaction) => {
			// 1) Снижаем остатки в контексте trx
			await this.productService.decreaseRemains(
				dto.productId,
				dto.quantitySold,
				trx
			)

                        // 2) Получаем цену продажи для расчёта totalPrice в контексте trx
                        const product = await this.productService.findOne(
                                dto.productId,
                                trx
                        )
                        const totalPrice = product.salePrice * dto.quantitySold

			// 3) Создаём запись о продаже
			const sale = await this.saleRepo.create(
				{
					saleDate: dto.saleDate,
					productId: dto.productId,
					quantitySold: dto.quantitySold,
					totalPrice
				},
				{ transaction: trx }
			)

			return sale
		})
	}

	/**
	 * Возвращает все продажи с информацией о товаре.
	 */
	async findAll(): Promise<SaleModel[]> {
		return this.saleRepo.findAll({ include: ['product'] })
	}

	/**
	 * Возвращает одну продажу по ID. Без транзакции.
	 */
	async findOne(id: number): Promise<SaleModel> {
		const sale = await this.saleRepo.findByPk(id, { include: ['product'] })
		if (!sale) {
			throw new NotFoundException(`Sale #${id} не найдена`)
		}
		return sale
	}

	/**
	 * Этапы обновления продажи:
	 * 1) Начать trx.
	 * 2) Получить sale внутри trx.
	 * 3) Вычислить diff и скорректировать remains с передачей trx.
	 * 4) Пересчитать totalPrice и обновить запись.
	 */
	async update(id: number, dto: UpdateSaleDto): Promise<SaleModel> {
		return this.sequelize.transaction(async (trx: Transaction) => {
			// 1) Читаем запись внутри trx
			const sale = await this.saleRepo.findByPk(id, {
				include: ['product'],
				transaction: trx
			})
			if (!sale) {
				throw new NotFoundException(`Sale #${id} не найдена`)
			}

			// 2) Корректируем оставшиеся запасы
			const oldQty = sale.quantitySold
			const newQty = dto.quantitySold ?? oldQty
			const diff = newQty - oldQty
			if (diff > 0) {
				await this.productService.decreaseRemains(sale.productId, diff, trx)
			} else if (diff < 0) {
				await this.productService.increaseRemains(sale.productId, -diff, trx)
			}

			// 3) Пересчитываем totalPrice
			const salePrice = sale.product.salePrice
			const totalPrice = salePrice * newQty

			// 4) Обновляем запись в trx
			await sale.update(
				{
					quantitySold: newQty,
					saleDate: dto.saleDate ?? sale.saleDate,
					totalPrice
				},
				{ transaction: trx }
			)

			return sale
		})
	}

	/**
	 * Этапы удаления продажи:
	 * 1) Начать trx.
	 * 2) Получить sale внутри trx.
	 * 3) Вернуть remains с передачей trx.
	 * 4) Удалить запись.
	 */
	async remove(id: number): Promise<void> {
		return this.sequelize.transaction(async (trx: Transaction) => {
			// 1) Читаем sale внутри trx
			const sale = await this.saleRepo.findByPk(id, { transaction: trx })
			if (!sale) {
				throw new NotFoundException(`Sale #${id} не найдена`)
			}

			// 2) Возвращаем запасы в контексте trx
			await this.productService.increaseRemains(
				sale.productId,
				sale.quantitySold,
				trx
			)

			// 3) Удаляем запись о продаже
			await sale.destroy({ transaction: trx })
		})
	}
}
