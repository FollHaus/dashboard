import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put
} from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskModel } from './task.model'
import { CreateTaskDto } from './dto/task.dto'
import { UpdateTaskDto } from './dto/update.task.dto'

@Controller('task')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Post()
	async create(@Body() dto: CreateTaskDto): Promise<TaskModel> {
		return this.taskService.create(dto)
	}

	@Get()
	async findAll(): Promise<TaskModel[]> {
		return this.taskService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number): Promise<TaskModel> {
		return this.taskService.findOne(id)
	}

	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateTaskDto
	): Promise<TaskModel> {
		return this.taskService.update(id, dto)
	}

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		return this.taskService.remove(id)
	}
}
