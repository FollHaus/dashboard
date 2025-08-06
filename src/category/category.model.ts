import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { ProductModel } from '../product/product.model'

@Table({ tableName: 'Category', deletedAt: false, version: false })
export class CategoryModel extends Model {
	@Column({ unique: true, type: DataType.STRING })
	name: string // название категории

	@HasMany(() => ProductModel)
	products: ProductModel[] // список продуктов
}

/*
@HasMany(() => ProductModel), что означает, что категория может иметь множество продуктов.
* */
