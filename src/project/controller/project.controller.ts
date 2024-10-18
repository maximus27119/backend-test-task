import { Controller, Get, Request, UseGuards, Query } from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { ProjectListResponse } from '../dto/project-list-response.dto';
import { Project } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async list(@Request() req, @Query() query): Promise<ProjectListResponse> {
    const userId = req.user.sub as number;
    const limit = (query.limit as number) ?? 10;
    const offset = (query.offset as number) ?? 0;
    const search = query.search as string;

    const list: Project[] = await this.projectService.findMany({
      where: {
        userId,
        status: { not: 'deleted' },
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { url: { contains: search } },
              ],
            }
          : {}),
      },
      take: limit,
      skip: offset,
    });

    return list.map((x: Project) => ({
      id: x.id,
      name: x.name,
      url: x.url,
      status: x.status,
      expiredAt: x.expiredAt,
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    }));
  }
}
