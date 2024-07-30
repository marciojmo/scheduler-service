import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/prisma.service';
import { ScheduleService } from 'src/schedule/schedule.service';

@Module({
  providers: [TaskService, PrismaService, ScheduleService],
  controllers: [TaskController]
})
export class TaskModule { }
