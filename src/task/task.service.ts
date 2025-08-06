import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { TaskModel } from './task.model'
import { CreateTaskDto } from './dto/task.dto'
import { UpdateTaskDto } from './dto/update.task.dto'

@Injectable()
export class TaskService {
	constructor(
		@InjectModel(TaskModel) private readonly taskRepo: typeof TaskModel
	) {}

	async create(dto: CreateTaskDto): Promise<TaskModel> {
		return this.taskRepo.create({ ...dto })
	}

	async findAll(): Promise<TaskModel[]> {
		return this.taskRepo.findAll()
	}

	async findOne(id: number): Promise<TaskModel> {
		const task = await this.taskRepo.findByPk(id)
		if (!task) {
			throw new NotFoundException(`Task #${id} не найдена`)
		}
		return task
	}

	async update(id: number, dto: UpdateTaskDto): Promise<TaskModel> {
		const task = await this.findOne(id)
		return task.update(dto)
	}

	async remove(id: number): Promise<void> {
		const task = await this.findOne(id)
		await task.destroy()
	}
}
