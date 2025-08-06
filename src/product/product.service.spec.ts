import { BadRequestException } from '@nestjs/common'
jest.mock('./product.model', () => ({}), { virtual: true })
jest.mock('../category/category.model', () => ({}), { virtual: true })
jest.mock('@nestjs/sequelize', () => ({
	InjectModel: () => () => {},
	InjectConnection: () => () => {}
}))
import { ProductService } from './product.service'

describe('ProductService.decreaseRemains', () => {
	let service: ProductService
	let productRepo: { decrement: jest.Mock }
	let sequelize: { transaction: jest.Mock }

	beforeEach(() => {
		productRepo = { decrement: jest.fn() } as any
		sequelize = { transaction: jest.fn() } as any
		service = new ProductService(
			productRepo as any,
			{} as any,
			sequelize as any
		)
	})

	it('throws when remains are insufficient', async () => {
		jest
			.spyOn(service, 'findOne')
			.mockResolvedValue({ id: 1, remains: 1 } as any)
		const trx = {} as any
		await expect(service.decreaseRemains(1, 5, trx)).rejects.toThrow(
			BadRequestException
		)
		expect(productRepo.decrement).not.toHaveBeenCalled()
	})

	it('decrements when enough remains', async () => {
		jest
			.spyOn(service, 'findOne')
			.mockResolvedValue({ id: 1, remains: 10 } as any)
		const trx = {} as any
		await service.decreaseRemains(1, 5, trx)
		expect(productRepo.decrement).toHaveBeenCalledWith(
			{ remains: 5 },
			{ where: { id: 1 }, transaction: trx }
		)
	})
})
