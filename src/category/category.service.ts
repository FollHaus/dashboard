import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CategoryModel } from './category.model'
import { ProductModel } from '../product/product.model'
import { CreateCategoryDto } from './dto/category.dto'
import { UpdateCategoryDto } from './dto/update.category.dto'

/**
 * Сервис для работы с категориями.
 * Обеспечивает CRUD-операции и управление связанными продуктами.
 */
@Injectable()
export class CategoryService {
	constructor(
		@InjectModel(CategoryModel)
		private readonly categoryRepo: typeof CategoryModel
	) {}

	/**
	 * Создаёт новую категорию.
	 *
	 * @param dto - DTO с данными новой категории
	 * @returns Новая созданная категория
	 */
	async create(dto: CreateCategoryDto): Promise<CategoryModel> {
		return this.categoryRepo.create({
			name: dto.name
		})
	}

	/**
	 * Получает список всех категорий с вложенными продуктами.
	 *
	 * @returns Массив объектов CategoryModel
	 */
	async findAll(): Promise<CategoryModel[]> {
		return this.categoryRepo.findAll({ include: [ProductModel] })
	}

	/**
	 * Получает категорию по её ID с вложенными продуктами.
	 *
	 * @param id - Идентификатор категории
	 * @returns Объект CategoryModel
	 * @throws NotFoundException - Если категория не найдена
	 */
	async findOne(id: number): Promise<CategoryModel> {
		const category = await this.categoryRepo.findByPk(id, {
			include: [ProductModel]
		})
		if (!category) {
			throw new NotFoundException(`Категория с id=${id} не найдена`)
		}
		return category
	}

	/**
	 * Обновляет данные существующей категории.
	 *
	 * @param id - Идентификатор категории
	 * @param dto - DTO с обновлёнными данными
	 * @returns Обновлённая категория
	 */
	async update(id: number, dto: UpdateCategoryDto): Promise<CategoryModel> {
		const category = await this.findOne(id)
		return category.update(dto)
	}

	/**
	 * Удаляет категорию по её ID.
	 *
	 * @param id - Идентификатор категории
	 * @throws NotFoundException - Если категория не найдена
	 */
	async remove(id: number): Promise<void> {
		const deletedCount = await this.categoryRepo.destroy({ where: { id } })
		if (!deletedCount) {
			throw new NotFoundException(`Категория с id=${id} не найдена`)
		}
	}
}
