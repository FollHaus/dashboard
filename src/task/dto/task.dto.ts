import {
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator'
import { TaskStatus } from '../task.model'

export class CreateTaskDto {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	@IsOptional()
	description?: string

	@IsDateString()
	deadline: string

	@IsEnum(TaskStatus)
	@IsOptional()
	status?: TaskStatus

	@IsString()
	@IsOptional()
	executor?: string
}
