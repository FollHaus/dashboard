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
import { ProductService } from './product.service'
import { ProductModel } from './product.model'
import { CreateProductDto } from './dto/product.dto'
import { UpdateProductDto } from './dto/update.product.dto'
import { AddStockDto } from './dto/stock.dto'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	/**
	 * Создание нового продукта
	 */
	@Post()
	async create(@Body() dto: CreateProductDto): Promise<ProductModel> {
		return this.productService.create(dto)
	}

	/**
	 * Получение списка всех продуктов
	 */
	@Get()
	async findAll(): Promise<ProductModel[]> {
		return this.productService.findAll()
	}

	/**
	 * Получение одного продукта по ID
	 */
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductModel> {
		return this.productService.findOne(id)
	}

	/**
	 * Обновление продукта по ID
	 */
	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateProductDto
	): Promise<ProductModel> {
		return this.productService.update(id, dto)
	}

	/**
	 * Удаление продукта по ID
	 */
	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		return this.productService.remove(id)
	}

	/**
	 * Получение статистики продукта (проданные единицы и выручка)
	 */
	@Get(':id/stats')
	async stats(
		@Param('id', ParseIntPipe) id: number
	): Promise<{ totalUnits: number; totalRevenue: number }> {
		return this.productService.getStats(id)
	}

	/** Для прихода на склад */
	@Post(':id/stock')
	async addStock(
		@Param('id', ParseIntPipe) id: number,
		@Body() { qty }: AddStockDto
	) {
		await this.productService.increaseRemains(id, qty)
		return { message: `Количество единиц товара ${id} увеличено на ${qty}` }
	}
}
