import { IsDateString, IsInt, IsPositive } from 'class-validator'

export class CreateSaleDto {
	@IsInt()
	@IsPositive()
	productId: number

	@IsInt()
	@IsPositive()
	quantitySold: number

        @IsDateString()
        saleDate: string // формат ISO
}
