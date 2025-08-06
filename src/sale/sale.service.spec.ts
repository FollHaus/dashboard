import { SaleService } from './sale.service'
import { UpdateSaleDto } from './dto/update.sale.dto'

describe('SaleService.update', () => {
        it('should handle product change with stock adjustments and price recalculation', async () => {
                const sale: any = {
                        id: 1,
                        productId: 1,
                        quantitySold: 5,
                        saleDate: '2024-01-01',
                        product: { salePrice: 10 },
                        update: jest.fn(function (data) {
                                Object.assign(this, data)
                        })
                }

                const saleRepo = {
                        findByPk: jest.fn().mockResolvedValue(sale)
                }

                const productService = {
                        increaseRemains: jest.fn().mockResolvedValue(undefined),
                        decreaseRemains: jest.fn().mockResolvedValue(undefined),
                        findOne: jest
                                .fn()
                                .mockResolvedValue({ salePrice: 20 })
                }

                const trx = {}
                const sequelize = {
                        transaction: (cb: any) => cb(trx)
                }

                const service = new SaleService(
                        saleRepo as any,
                        sequelize as any,
                        productService as any
                )

                const dto: UpdateSaleDto = { productId: 2, quantitySold: 3 }
                await service.update(1, dto)

                expect(productService.increaseRemains).toHaveBeenCalledWith(
                        1,
                        5,
                        trx
                )
                expect(productService.decreaseRemains).toHaveBeenCalledWith(
                        2,
                        3,
                        trx
                )
                expect(productService.findOne).toHaveBeenCalledWith(2, trx)
                expect(sale.update).toHaveBeenCalledWith(
                        {
                                productId: 2,
                                quantitySold: 3,
                                saleDate: '2024-01-01',
                                totalPrice: 60
                        },
                        { transaction: trx }
                )
        })
})
