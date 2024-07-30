import { Module } from '@nestjs/common';
import { ScheduleModule } from './schedule/schedule.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [ScheduleModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
