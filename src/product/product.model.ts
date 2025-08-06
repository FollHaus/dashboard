import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	Table
} from 'sequelize-typescript'
import { CategoryModel } from '../category/category.model'
import { SaleModel } from '../sale/sale.model'

@Table({
	tableName: 'Product',
	deletedAt: false,
	version: false,
	indexes: [{ fields: ['name'] }, { fields: ['category_id'] }]
})
export class ProductModel extends Model {
	@Column(DataType.STRING)
	name: string // Название

	@ForeignKey(() => CategoryModel)
	@Column({ field: 'category_id', allowNull: false, type: DataType.INTEGER })
	categoryId: number // Категория

	@BelongsTo(() => CategoryModel)
	category: CategoryModel // Категория

	//@HasMany для получения всех продаж по продукту
	@HasMany(() => SaleModel)
	sales: SaleModel[] // Все продажи этого продукта

	@Column({ unique: true, field: 'article_number', type: DataType.STRING })
	articleNumber: string // Артикул

	@Column({ field: 'purchase_price', type: DataType.DECIMAL(10, 2) })
	purchasePrice: number // Закупочная цена

	@Column({ field: 'sale_price', type: DataType.DECIMAL(10, 2) })
	salePrice: number // Продажная цена

	@Column(DataType.INTEGER)
	remains: number // Остаток
}

/*
Модель продукта
name - название
category - категория
articleNumber - артикул
purchasePrice - закупочная цена
salePrice - продажная цена
remains - остаток

@BelongsTo(() => CategoryModel) и @ForeignKey указывает на принадлежность продукта к определенной категории.
* */
