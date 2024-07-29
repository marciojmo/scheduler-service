import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Schedule, Prisma } from '@prisma/client';

@Injectable()
export class ScheduleService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ScheduleCreateInput): Promise<Schedule> {
        return this.prisma.schedule.create({ data });
    }

    async getAll(): Promise<Schedule[]> {
        return this.prisma.schedule.findMany();
    }

    async getById(id: string): Promise<Schedule> {
        const schedule = await this.prisma.schedule.findUnique({ where: { id } });
        if (!schedule) {
            throw new NotFoundException(`Schedule with ID ${id} not found`);
        }
        return schedule;
    }

    async updateById(id: string, data: Prisma.ScheduleUpdateInput): Promise<Schedule> {
        const schedule = await this.prisma.schedule.findUnique({ where: { id } });
        if (!schedule) {
            throw new NotFoundException(`Schedule with ID ${id} not found`);
        }
        return this.prisma.schedule.update({
            where: { id },
            data,
        });
    }

    async deleteById(id: string): Promise<Schedule> {
        const schedule = await this.prisma.schedule.findUnique({ where: { id } });
        if (!schedule) {
            throw new NotFoundException(`Schedule with ID ${id} not found`);
        }
        return this.prisma.schedule.delete({
            where: { id }
        });
    }

}
