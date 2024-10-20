import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './service/project.service';
import { PrismaService } from '../lib/prisma';
import { ProjectTasksService } from './service/project-tasks.service';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectTasksService, PrismaService],
})
export class ProjectModule {}
