import { IsNotEmpty, IsInt, IsDate } from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateScheduleDto {

    @Exclude()
    id: string;

    @IsInt()
    @IsNotEmpty()
    account_id: number;

    @IsInt()
    @IsNotEmpty()
    agent_id: number;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    start_time: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    end_time: Date;
}

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) { }