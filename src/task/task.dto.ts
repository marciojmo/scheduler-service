import { IsNotEmpty, IsInt, IsDate, IsUUID, IsEnum } from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { Schedule, TaskType } from '@prisma/client';

export class CreateTaskDto {

    @Exclude()
    id: string;

    @IsInt()
    @IsNotEmpty()
    account_id: number;

    @IsUUID()
    @IsNotEmpty()
    schedule_id: string;

    schedule: Schedule;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    start_time: Date;

    @IsInt()
    @IsNotEmpty()
    duration: number;

    @IsEnum(TaskType)
    @IsNotEmpty()
    type: TaskType;


}

export class UpdateTaskDto extends PartialType(CreateTaskDto) { }