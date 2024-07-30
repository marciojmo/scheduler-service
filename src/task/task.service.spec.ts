import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { TaskService } from './task.service';
import { NotFoundException } from '@nestjs/common';
import { Task, TaskType } from '@prisma/client';

const prismaMock = {
  task: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('create', () => {
    it('should create a task and returns its properties', async () => {
      const taskDto = {
        "account_id": 1,
        "schedule": {
          connect: {
            id: "c5fa61fd-59de-4a53-aa35-525943de3c25"
          }
        },
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "duration": 300,
        "type": TaskType.BREAK
      };
      const createdTask = {
        "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
        "schedule_id": "c5fa61fd-59de-4a53-aa35-525943de3c25",
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "duration": 300,
        "type": TaskType.WORK
      } as Task;

      jest.spyOn(prisma.task, 'create').mockResolvedValue(createdTask);

      const task = await service.create(taskDto);
      expect(task).toBe(createdTask);
    });
  });

  describe('getAll', () => {
    it('should return a valid array of tasks', async () => {
      const baseTask = {
        "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
        "schedule_id": "c5fa61fd-59de-4a53-aa35-525943de3c25",
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "duration": 300,
        "type": TaskType.WORK
      };
      const allTasks = [
        {
          "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
          ...baseTask
        },
        {
          "id": "e49da36a-c924-4c9a-a128-3837f01a41eb",
          ...baseTask
        },
        {
          "id": "e49da36a-c924-4c9a-a128-3837f01a41xs",
          ...baseTask
        }
      ] as Task[];
      jest.spyOn(prisma.task, 'findMany').mockResolvedValue(allTasks);

      const tasks = await service.getAll();
      expect(tasks).toStrictEqual(allTasks);
    });

    it('should return an empty list of tasks', async () => {
      jest.spyOn(prisma.task, 'findMany').mockResolvedValue([]);

      const tasks = await service.getAll();
      expect(tasks).toStrictEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a task if it exists', async () => {
      const id = 'c5fa61fd-59de-4a53-aa35-525943de3c21';
      const existingTask =
      {
        "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
        "schedule_id": "c5fa61fd-59de-4a53-aa35-525943de3c25",
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "duration": 300,
        "type": TaskType.WORK
      };
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(existingTask);

      const task = await service.getById(id);
      expect(task).toBe(existingTask);
    });

    it('should throw a NotFoundException if task does not exist', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(null);

      const id = 'non-existing-id';
      await expect(service.getById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateById', () => {

    it('should update a task if it exists', async () => {
      const id = 'c5fa61fd-59de-4a53-aa35-525943de3c21';
      const updateTaskDto = {
        "account_id": 5
      };
      const existingTask = {
        "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
        "schedule_id": "c5fa61fd-59de-4a53-aa35-525943de3c25",
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "duration": 300,
        "type": TaskType.WORK
      } as Task;
      const updatedTask = {
        ...existingTask,
        ...updateTaskDto
      } as Task;
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(existingTask);
      jest.spyOn(prisma.task, 'update').mockResolvedValue(updatedTask);

      const result = await service.updateById(id, updateTaskDto);
      expect(result).toBe(updatedTask);

    });

    it('should throw a NotFoundException if task does not exist', async () => {
      const id = 'non-existing-id';
      const updateTaskDto = { "account_id": 555 };
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(null);

      await expect(service.updateById(id, updateTaskDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteById', () => {
    it('should delete a task if it exists', async () => {
      const id = 'some-id';
      const existingTask = {
        "id": "c5fa61fd-59de-4a53-aa35-525943de3c21",
        "schedule_id": "c5fa61fd-59de-4a53-aa35-525943de3c25",
        "account_id": 1,
        "start_time": new Date("2024-07-28T21:00:00.000Z"),
        "duration": 300,
        "type": TaskType.WORK
      } as Task;
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(existingTask);
      jest.spyOn(prisma.task, 'delete').mockResolvedValue(existingTask);

      const result = await service.deleteById(id);
      expect(result).toBe(existingTask);
    });

    it('should throw a NotFoundException if task does not exist', async () => {
      const id = 'non-existing-id';
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(null);
      await expect(service.deleteById(id)).rejects.toThrow(NotFoundException);
    });
  });
});