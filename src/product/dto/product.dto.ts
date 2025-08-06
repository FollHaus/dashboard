import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateIf
} from 'class-validator'

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	articleNumber: string

	@IsNumber({ maxDecimalPlaces: 2 })
	purchasePrice: number

	@IsNumber({ maxDecimalPlaces: 2 })
	salePrice: number

	@IsNumber() @Min(0) @IsOptional() remains?: number

	@IsOptional()
	@IsNumber()
	@ValidateIf((o) => !o.categoryName, {
		message: 'Укажите либо categoryId, либо categoryName, но не оба сразу.'
	})
	categoryId?: number

	@IsOptional()
	@IsString()
	@ValidateIf((o) => !o.categoryId, {
		message: 'Укажите либо categoryName, либо categoryId, но не оба сразу.'
	})
	categoryName?: string
}
