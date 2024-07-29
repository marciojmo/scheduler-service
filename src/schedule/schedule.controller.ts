import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule as ScheduleModel } from '@prisma/client';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';

@Controller('api/v1/schedule')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() schedule: CreateScheduleDto): Promise<ScheduleModel> {
        return this.scheduleService.create(schedule);
    }

    @Get()
    async getAll(): Promise<ScheduleModel[]> {
        return this.scheduleService.getAll();
    }

    @Get(':id')
    async getById(@Param('id', ParseUUIDPipe) id: string): Promise<ScheduleModel> {
        return this.scheduleService.getById(id);
    }

    @Put(':id')
    async updateById(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() schedule: UpdateScheduleDto
    ): Promise<ScheduleModel> {
        return this.scheduleService.updateById(id, schedule);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteById(@Param('id', ParseUUIDPipe) id: string): Promise<ScheduleModel> {
        return this.scheduleService.deleteById(id);
    }
}