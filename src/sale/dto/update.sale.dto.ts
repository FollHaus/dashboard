import { PartialType } from '@nestjs/mapped-types'
import { CreateSaleDto } from './sale.dto'

export class UpdateSaleDto extends PartialType(CreateSaleDto) {}
