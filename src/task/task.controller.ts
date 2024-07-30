import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task as TaskModel } from '@prisma/client';
import { ScheduleService } from 'src/schedule/schedule.service';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';

@Controller('api/v1/tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService, private readonly scheduleService: ScheduleService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() task: CreateTaskDto): Promise<TaskModel> {
        try {
            // Checking if schedule exists
            const schedule = await this.scheduleService.getById(task.schedule_id);
            const taskCreate = {
                ...task,
                schedule: { connect: { id: schedule.id } }
            };
            // Relationship is expressed via 'connect' (code above) in prisma's TaskCreateInput
            // therefore the schedule_id must be deleted before creating a new task.
            delete taskCreate.schedule_id;
            const createdTask = await this.taskService.create(taskCreate);
            // TODO: notify schedule timestamp update?
            return createdTask;
        }
        catch (error) {
            throw error;
        }
    }

    @Get()
    async getAll(): Promise<TaskModel[]> {
        return this.taskService.getAll();
    }

    @Get(':id')
    async getById(@Param('id', ParseUUIDPipe) id: string): Promise<TaskModel> {
        return this.taskService.getById(id);
    }

    @Put(':id')
    async updateById(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() task: UpdateTaskDto
    ): Promise<TaskModel> {
        try {
            let taskUpdate: any = { ...task };
            if (task.schedule_id !== undefined) {
                // Checking if schedule exists
                const schedule = await this.scheduleService.getById(task.schedule_id);
                taskUpdate = {
                    ...task,
                    schedule: { connect: { id: schedule.id } }
                }
            }
            // TODO: notify schedule timestamp update? (And the previous one if the schedule has changed?)
            return this.taskService.updateById(id, taskUpdate);
        } catch (error) {
            throw error;
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteById(@Param('id', ParseUUIDPipe) id: string): Promise<TaskModel> {
        return this.taskService.deleteById(id);
    }
}