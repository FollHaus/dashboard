import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table
} from 'sequelize-typescript'
import { ProductModel } from '../product/product.model'

@Table({
	tableName: 'Sale',
	deletedAt: false,
	version: false,
	indexes: [
		{ fields: ['sale_date'] },
		{ fields: ['product_id'] },
		{ fields: ['quantity_sold'] }
	]
})
export class SaleModel extends Model {
	@Column({
		type: DataType.DATEONLY,
		allowNull: false,
		field: 'sale_date'
	})
	saleDate: string

	@ForeignKey(() => ProductModel)
	@Column({ field: 'product_id', type: DataType.INTEGER })
	productId: number // ссылка на товар

	@BelongsTo(() => ProductModel)
	product: ProductModel // Товар

	@Column({ field: 'quantity_sold', type: DataType.INTEGER })
	quantitySold: number // Количество проданного товара

	@Column({ field: 'total_price', type: DataType.DECIMAL(10, 2) })
	totalPrice: number // Общая сумма продажи
}

//@BelongsTo(() => ProductModel) и @ForeignKey, что указывает на принадлежность продажи конкретному продукту.
