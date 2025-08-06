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
import { SaleService } from './sale.service'
import { SaleModel } from './sale.model'
import { CreateSaleDto } from './dto/sale.dto'
import { UpdateSaleDto } from './dto/update.sale.dto'

@Controller('sales')
export class SaleController {
	constructor(private readonly saleService: SaleService) {}

	/** Создает новую продажу */
	@Post()
	async create(@Body() dto: CreateSaleDto): Promise<SaleModel> {
		return this.saleService.createSale(dto)
	}

	/** Возвращает список всех продаж */
	@Get()
	async findAll(): Promise<SaleModel[]> {
		return this.saleService.findAll()
	}

	/** Возвращает одну продажу по ID */
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number): Promise<SaleModel> {
		return this.saleService.findOne(id)
	}

	/** Обновляет продажу по ID */
	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateSaleDto
	): Promise<SaleModel> {
		return this.saleService.update(id, dto)
	}

	/** Удаляет продажу по ID */
	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		return this.saleService.remove(id)
	}
}
