import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { ScheduleService } from './schedule.service';
import { NotFoundException } from '@nestjs/common';
import { Schedule } from '@prisma/client';

const prismaMock = {
  schedule: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    prisma = module.get<PrismaService>(PrismaService);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('create', () => {
    it('should create a schedule and returns its properties', async () => {
      const scheduleDto = {
        "agent_id": 1,
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "end_time": new Date("2024-07-28T21:00:00.000Z")
      };
      const createdSchedule = {
        "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
        ...scheduleDto
      } as Schedule;
      jest.spyOn(prisma.schedule, 'create').mockResolvedValue(createdSchedule);

      const schedule = await service.create(scheduleDto);
      expect(schedule).toBe(createdSchedule);
    });
  });

  describe('getAll', () => {
    it('should return a valid array of schedules', async () => {
      const baseSchedule = {
        "agent_id": 1,
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "end_time": new Date("2024-07-28T21:00:00.000Z")
      }
      const allSchedules = [
        {
          "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
          ...baseSchedule
        },
        {
          "id": "e49da36a-c924-4c9a-a128-3837f01a41eb",
          ...baseSchedule
        },
        {
          "id": "e49da36a-c924-4c9a-a128-3837f01a41xs",
          ...baseSchedule
        }
      ] as Schedule[];
      jest.spyOn(prisma.schedule, 'findMany').mockResolvedValue(allSchedules);

      const schedules = await service.getAll();
      expect(schedules).toStrictEqual(allSchedules);
    });

    it('should return an empty list of schedules', async () => {
      jest.spyOn(prisma.schedule, 'findMany').mockResolvedValue([]);

      const schedules = await service.getAll();
      expect(schedules).toStrictEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a schedule if it exists', async () => {
      const id = 'c5fa61fd-59de-4a53-aa35-525943de3c21';
      const existingSchedule =
      {
        "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
        "agent_id": 1,
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "end_time": new Date("2024-07-28T21:00:00.000Z")
      };
      jest.spyOn(prisma.schedule, 'findUnique').mockResolvedValue(existingSchedule);

      const schedule = await service.getById(id);
      expect(schedule).toBe(existingSchedule);
    });

    it('should throw a NotFoundException if schedule does not exist', async () => {
      jest.spyOn(prisma.schedule, 'findUnique').mockResolvedValue(null);

      const id = 'non-existing-id';
      await expect(service.getById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateById', () => {

    it('should update a schedule if it exists', async () => {
      const id = 'c5fa61fd-59de-4a53-aa35-525943de3c21';
      const updateScheduleDto = {
        "agent_id": 5
      };
      const existingSchedule = {
        "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
        "agent_id": 1,
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "end_time": new Date("2024-07-28T21:00:00.000Z")
      } as Schedule;
      const updatedSchedule = {
        ...existingSchedule,
        ...updateScheduleDto
      } as Schedule;
      jest.spyOn(prisma.schedule, 'findUnique').mockResolvedValue(existingSchedule);
      jest.spyOn(prisma.schedule, 'update').mockResolvedValue(updatedSchedule);

      const result = await service.updateById(id, updateScheduleDto);
      expect(result).toBe(updatedSchedule);

    });

    it('should throw a NotFoundException if schedule does not exist', async () => {
      const id = 'non-existing-id';
      const updateScheduleDto = { "agent_id": 555 };
      jest.spyOn(prisma.schedule, 'findUnique').mockResolvedValue(null);

      await expect(service.updateById(id, updateScheduleDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteById', () => {
    it('should delete a schedule if it exists', async () => {
      const id = 'some-id';
      const existingSchedule = {
        "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
        "agent_id": 1,
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "end_time": new Date("2024-07-28T21:00:00.000Z")
      } as Schedule;
      jest.spyOn(prisma.schedule, 'findUnique').mockResolvedValue(existingSchedule);
      jest.spyOn(prisma.schedule, 'delete').mockResolvedValue(existingSchedule);

      const result = await service.deleteById(id);
      expect(result).toBe(existingSchedule);
    });

    it('should throw a NotFoundException if schedule does not exist', async () => {
      const id = 'non-existing-id';
      jest.spyOn(prisma.schedule, 'findUnique').mockResolvedValue(null);
      await expect(service.deleteById(id)).rejects.toThrow(NotFoundException);
    });
  });
});