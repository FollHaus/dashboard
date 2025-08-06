import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryModel } from './category.model'
import { CreateCategoryDto } from './dto/category.dto'
import { UpdateCategoryDto } from './dto/update.category.dto'

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	// Создание категории
	@Post()
	async create(@Body() dto: CreateCategoryDto): Promise<CategoryModel> {
		return this.categoryService.create(dto)
	}

	// Получение всех категорий
	@Get()
	async findAll(): Promise<CategoryModel[]> {
		return this.categoryService.findAll()
	}

	// Получение одной категории по ID
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryModel> {
		return this.categoryService.findOne(id)
	}

	// Обновление категории
	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateCategoryDto
	): Promise<CategoryModel> {
		return this.categoryService.update(id, dto)
	}

	// Удаление категории
	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		return this.categoryService.remove(id)
	}
}
