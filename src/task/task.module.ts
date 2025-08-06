import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { TaskModel } from './task.model'

@Module({
	imports: [SequelizeModule.forFeature([TaskModel])],
	controllers: [TaskController],
	providers: [TaskService]
})
export class TaskModule {}
