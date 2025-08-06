import { IsDateString, IsInt, IsNumber, IsPositive } from 'class-validator'

export class CreateSaleDto {
	@IsInt()
	@IsPositive()
	productId: number

	@IsInt()
	@IsPositive()
	quantitySold: number

	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	totalPrice: number

	@IsDateString()
	saleDate: string // формат ISO
}
