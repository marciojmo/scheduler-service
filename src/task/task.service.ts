import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.TaskCreateInput): Promise<Task> {
        return this.prisma.task.create({ data });
    }

    async getAll(): Promise<Task[]> {
        return this.prisma.task.findMany();
    }

    async getById(id: string): Promise<Task> {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    async updateById(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return this.prisma.task.update({
            where: { id },
            data,
        });
    }

    async deleteById(id: string): Promise<Task> {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return this.prisma.task.delete({
            where: { id }
        });
    }
}
