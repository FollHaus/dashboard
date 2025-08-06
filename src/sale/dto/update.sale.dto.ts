import { PartialType } from '@nestjs/swagger'
import { CreateSaleDto } from './sale.dto'

export class UpdateSaleDto extends PartialType(CreateSaleDto) {}
