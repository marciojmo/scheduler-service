import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TaskModule } from './task.module'
import { TaskService } from './task.service';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './task.dto';
import { TaskType } from '@prisma/client';
import { ScheduleService } from 'src/schedule/schedule.service';

describe('TaskController', () => {
  let app: INestApplication;

  const mockTask = {
    "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
    "schedule_id": "c5fa61fd-59de-4a53-aa35-525943de3c25",
    "account_id": 1,
    "start_time": "2024-07-28T21:00:00.000Z",
    "duration": 300,
    "type": TaskType.WORK
  };

  const mockSchedule = {
    "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
    "agent_id": 1,
    "account_id": 1,
    "start_time": "2024-07-28T21:00:00.000Z",
    "end_time": "2024-07-28T21:00:00.000Z"
  };

  const taskService = {
    getAll: () => [mockTask],
    create: () => mockTask,
    getById: () => mockTask,
    updateById: () => mockTask,
    deleteById: () => { }
  }

  const scheduleService = {
    getAll: () => [mockSchedule],
    create: () => mockSchedule,
    getById: () => mockSchedule,
    updateById: () => mockSchedule,
    deleteById: () => { }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TaskModule],
    })
      .overrideProvider(TaskService)
      .useValue(taskService)
      .overrideProvider(ScheduleService)
      .useValue(scheduleService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/GET (all) /api/v1/tasks', () => {
    it(`should return a list of tasks`, () => {
      return request(app.getHttpServer())
        .get('/api/v1/tasks')
        .expect(HttpStatus.OK)
        .expect(taskService.getAll());
    });
  });

  describe('/GET (by Id) /api/v1/tasks', () => {
    it(`should return bad request if an invalid uuid is given`, () => {
      return request(app.getHttpServer())
        .get('/api/v1/tasks/invalid-uuid')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it(`should return a task`, () => {
      return request(app.getHttpServer())
        .get('/api/v1/tasks/c5fa61fd-59de-4a53-aa35-525943de3c21')
        .expect(HttpStatus.OK)
        .expect(taskService.getById());
    });
  });

  describe('/POST /api/v1/tasks', () => {
    it(`should return bad request if an invalid body is given`, () => {
      return request(app.getHttpServer())
        .post('/api/v1/tasks')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });

    it(`should create a task`, () => {
      const createTaskDto = {
        "schedule_id": "c5fa61fd-59de-4a53-aa35-525943de3c25",
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "duration": 300,
        "type": TaskType.WORK
      } as CreateTaskDto;

      return request(app.getHttpServer())
        .post('/api/v1/tasks')
        .send(createTaskDto)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('/PUT /api/v1/tasks', () => {
    it(`should return bad request if an invalid uuid is given`, () => {
      return request(app.getHttpServer())
        .put('/api/v1/tasks/invalid-uuid')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });

    it(`should update a task`, () => {
      const updateTaskDto = { "account_id": 1 };
      return request(app.getHttpServer())
        .put('/api/v1/tasks/c5fa61fd-59de-4a53-aa35-525943de3c21')
        .send(updateTaskDto)
        .expect(HttpStatus.OK)
        .expect(taskService.updateById());
    });
  });

  describe('/DELETE /api/v1/tasks', () => {
    it(`should return bad request if an invalid uuid is given`, () => {
      return request(app.getHttpServer())
        .delete('/api/v1/tasks/invalid-uuid')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it(`should delete a task`, () => {
      return request(app.getHttpServer())
        .delete('/api/v1/tasks/c5fa61fd-59de-4a53-aa35-525943de3c21')
        .expect(HttpStatus.NO_CONTENT);
    });
  });

});