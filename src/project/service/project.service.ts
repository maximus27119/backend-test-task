import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma';
import { Prisma, Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(args: Prisma.ProjectFindManyArgs): Promise<Project[]> {
    return this.prismaService.project.findMany(args);
  }

  async findOne(args: Prisma.ProjectFindFirstArgs): Promise<Project> {
    return this.prismaService.project.findFirst(args);
  }

  async create(args: Prisma.ProjectCreateArgs): Promise<Project> {
    return this.prismaService.project.create(args);
  }

  async update(args: Prisma.ProjectUpdateArgs): Promise<Project> {
    return this.prismaService.project.update(args);
  }

  async updateExpiredProjects() {
    await this.prismaService.project.updateMany({
      where: {
        expiredAt: {
          lt: new Date(),
        },
        status: 'active',
      },
      data: {
        status: 'expired',
      },
    });
  }
}
