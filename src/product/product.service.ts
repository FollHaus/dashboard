import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'
import { Sequelize, Transaction } from 'sequelize'
import { ProductModel } from './product.model'
import { CreateProductDto } from './dto/product.dto'
import { UpdateProductDto } from './dto/update.product.dto'
import { CategoryModel } from '../category/category.model'

/**
 * Сервис для работы с продуктами.
 * Реализует CRUD-операции, статистику и управление запасами.
 */
@Injectable()
export class ProductService {
	constructor(
		@InjectModel(ProductModel)
		private productRepo: typeof ProductModel,
		@InjectModel(CategoryModel)
		private categoryRepo: typeof CategoryModel,
		@InjectConnection()
		private sequelize: Sequelize
	) {}

	/**
	 * 1) Создаёт продукт.
	 * @param dto - данные для создания
	 */
	// Создание продукта с findOrCreate категории
	async create(dto: CreateProductDto): Promise<ProductModel> {
		let categoryId: number

		if (dto.categoryId) {
			// 1) Если передан ID — проверяем наличие
			const cat = await this.categoryRepo.findByPk(dto.categoryId)
			if (!cat) throw new NotFoundException('Категория с таким ID не найдена')
			categoryId = dto.categoryId
		} else if (dto.categoryName) {
			// 2) Если передано имя — ищем или создаем
			const [cat] = await this.categoryRepo.findOrCreate({
				where: { name: dto.categoryName.trim() },
				defaults: { name: dto.categoryName.trim() }
			})
			categoryId = cat.id
		} else {
			throw new BadRequestException('Укажите categoryId или categoryName')
		}

		// 3) Создаем продукт
		return this.productRepo.create({
			name: dto.name,
			categoryId,
			articleNumber: dto.articleNumber,
			purchasePrice: dto.purchasePrice,
			salePrice: dto.salePrice,
			remains: dto.remains ?? 0
		})
	}

	/**
	 * 2) Возвращает все продукты с категориями и продажами.
	 */
	async findAll(): Promise<ProductModel[]> {
		return this.productRepo.findAll({ include: ['category', 'sales'] })
	}

	/**
	 * 3) Возвращает один продукт по ID.
	 * @param id - идентификатор
	 * @param trx - опциональная транзакция для согласованного чтения
	 */
	async findOne(id: number, trx?: Transaction): Promise<ProductModel> {
		const prod = await this.productRepo.findByPk(id, {
			include: ['category', 'sales'],
			transaction: trx
		})
		if (!prod) {
			throw new NotFoundException(`Product #${id} не найден`)
		}
		return prod
	}

	/**
	 * 4) Обновляет продукт.
	 * @param id - идентификатор
	 * @param dto - новые данные
	 */
	async update(id: number, dto: UpdateProductDto): Promise<ProductModel> {
		const prod = await this.findOne(id)
		return prod.update(dto)
	}

	/**
	 * 5) Удаляет продукт.
	 * @param id - идентификатор
	 */
	async remove(id: number): Promise<void> {
		const prod = await this.findOne(id)
		await prod.destroy()
	}

	/**
	 * 6) Получает статистику: общее число продаж и выручка.
	 * @param id - идентификатор
	 */
	async getStats(
		id: number
	): Promise<{ totalUnits: number; totalRevenue: number }> {
		const prod = await this.findOne(id)

		// суммируем проданные единицы
		const totalUnits = prod.sales.reduce(
			(sum, sale) => sum + sale.quantitySold,
			0
		)
		// суммируем выручку, парсим DECIMAL в число
		const totalRevenue = prod.sales.reduce(
			(sum, sale) => sum + parseFloat(String(sale.totalPrice)),
			0
		)

		return { totalUnits, totalRevenue }
	}

	/**
	 * 7) Уменьшает остатки продукта.
	 * @param productId - ID продукта
	 * @param qty - сколько списать
	 * @param trx - опциональная транзакция
	 */
	async decreaseRemains(
		productId: number,
		qty: number,
		trx?: Transaction
	): Promise<void> {
		const operation = async (t: Transaction) => {
			const product = await this.findOne(productId, t)
			if (product.remains < qty) {
				throw new BadRequestException('Недостаточно остатков')
			}
			await this.productRepo.decrement(
				{ remains: qty },
				{ where: { id: productId }, transaction: t }
			)
		}

		if (trx) {
			// если передан trx — используем его
			await operation(trx)
		} else {
			// иначе создаём новую транзакцию
			await this.sequelize.transaction(async (t) => operation(t))
		}
	}

	/**
	 * 8) Увеличивает остатки продукта.
	 * @param productId - ID продукта
	 * @param qty - сколько добавить
	 * @param trx - опциональная транзакция
	 */
	async increaseRemains(
		productId: number,
		qty: number,
		trx?: Transaction
	): Promise<void> {
		const operation = async (t: Transaction) => {
			await this.productRepo.increment(
				{ remains: qty },
				{ where: { id: productId }, transaction: t }
			)
		}

		if (trx) {
			await operation(trx)
		} else {
			await this.sequelize.transaction(async (t) => operation(t))
		}
	}
}
