import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ScheduleModule } from './schedule.module'
import { ScheduleService } from './schedule.service';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { CreateScheduleDto } from './schedule.dto';
import { Schedule } from '@prisma/client';

describe('ScheduleController', () => {
  let app: INestApplication;

  const mockSchedule = {
    "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
    "agent_id": 1,
    "account_id": 1,
    "start_time": "2024-07-28T21:00:00.000Z",
    "end_time": "2024-07-28T21:00:00.000Z"
  };


  const scheduleService = {
    getAll: () => [mockSchedule],
    create: () => mockSchedule,
    getById: () => mockSchedule,
    updateById: () => mockSchedule,
    deleteById: () => { }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ScheduleModule],
    })
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

  describe('/GET (all) /api/v1/schedules', () => {
    it(`should return a list of schedules`, () => {
      return request(app.getHttpServer())
        .get('/api/v1/schedules')
        .expect(HttpStatus.OK)
        .expect(scheduleService.getAll());
    });
  });

  describe('/GET (by Id) /api/v1/schedules', () => {
    it(`should return bad request if an invalid uuid is given`, () => {
      return request(app.getHttpServer())
        .get('/api/v1/schedules/invalid-uuid')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it(`should return a schedule`, () => {
      return request(app.getHttpServer())
        .get('/api/v1/schedules/c5fa61fd-59de-4a53-aa35-525943de3c21')
        .expect(HttpStatus.OK)
        .expect(scheduleService.getById());
    });
  });

  describe('/POST /api/v1/schedules', () => {
    it(`should return bad request if an invalid body is given`, () => {
      return request(app.getHttpServer())
        .post('/api/v1/schedules')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });

    it(`should create a schedule`, () => {
      const createScheduleDto = {
        "agent_id": 1,
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "end_time": new Date("2024-07-28T21:00:00.000Z")
      } as CreateScheduleDto;

      return request(app.getHttpServer())
        .post('/api/v1/schedules')
        .send(createScheduleDto)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('/PUT /api/v1/schedules', () => {
    it(`should return bad request if an invalid uuid is given`, () => {
      return request(app.getHttpServer())
        .put('/api/v1/schedules/invalid-uuid')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });

    it(`should update a schedule`, () => {
      const updateScheduleDto = { "agent_id": 1 };
      return request(app.getHttpServer())
        .put('/api/v1/schedules/c5fa61fd-59de-4a53-aa35-525943de3c21')
        .send(updateScheduleDto)
        .expect(HttpStatus.OK)
        .expect(scheduleService.updateById());
    });
  });

  describe('/DELETE /api/v1/schedules', () => {
    it(`should return bad request if an invalid uuid is given`, () => {
      return request(app.getHttpServer())
        .delete('/api/v1/schedules/invalid-uuid')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it(`should delete a schedule`, () => {
      return request(app.getHttpServer())
        .delete('/api/v1/schedules/c5fa61fd-59de-4a53-aa35-525943de3c21')
        .expect(HttpStatus.NO_CONTENT);
    });
  });

});