import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CategoryModel } from './category.model'
import { ProductModel } from 'src/product/product.model'
import { CreateCategoryDto } from './dto/category.dto'
import { UpdateCategoryDto } from './dto/update.category.dto'

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel(CategoryModel)
		private readonly categoryRepo: typeof CategoryModel
	) {}

	// Создание новой категории
	async create(dto: CreateCategoryDto): Promise<CategoryModel> {
		return this.categoryRepo.create({
			name: dto.name
		})
	}

	// Получение списка всех категорий с продуктами
	async findAll(): Promise<CategoryModel[]> {
		return this.categoryRepo.findAll({ include: [ProductModel] })
	}

	// Получение категории по ID с продуктами
	async findOne(id: number): Promise<CategoryModel> {
		const category = await this.categoryRepo.findByPk(id, {
			include: [ProductModel]
		})
		if (!category) {
			throw new NotFoundException(`Категория с id=${id} не найдена`)
		}
		return category
	}

	// Обновление данных категории
	async update(id: number, dto: UpdateCategoryDto): Promise<CategoryModel> {
		const category = await this.findOne(id)
		return category.update(dto)
	}

	// Удаление категории
	async remove(id: number): Promise<void> {
		const deletedCount = await this.categoryRepo.destroy({ where: { id } })
		if (!deletedCount) {
			throw new NotFoundException(`Категория с id=${id} не найдена`)
		}
	}
}
