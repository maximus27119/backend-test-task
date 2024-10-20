import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectTasksService {
  constructor(private readonly projectService: ProjectService) {}

  @Cron('*/1 * * * *')
  async handleExpiredProjects() {
    await this.projectService.updateExpiredProjects();
  }
}
