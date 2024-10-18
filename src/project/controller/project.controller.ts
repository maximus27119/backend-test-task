import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { ProjectListResponse } from '../dto/project-list-response.dto';
import { Project, ProjectStatus } from '@prisma/client';
import { ProjectCreate } from '../dto/project-create.dto';
import { ProjectUpdate } from '../dto/project-update.dto';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async list(@Query() query, @Request() req): Promise<ProjectListResponse> {
    const userId = req.user.sub as number;
    const limit = (query.limit as number) ?? 10;
    const offset = (query.offset as number) ?? 0;
    const search = query.search as string;

    const list: Project[] = await this.projectService.findMany({
      where: {
        userId,
        isDeleted: false,
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

  @Get(':id')
  async getById(@Param('id') id: number, @Request() req): Promise<Project> {
    const userId = req.user.sub as number;
    return await this.projectService.findOne({
      where: { id, user: { id: userId } },
    });
  }

  @Post()
  async create(@Body() dto: ProjectCreate, @Request() req): Promise<Project> {
    const userId = req.user.sub as number;
    const projectObject = {
      ...dto,
      user: { connect: { id: userId } },
      createdAt: new Date(),
      status: ProjectStatus.active,
    };
    return await this.projectService.create({ data: projectObject });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: ProjectUpdate,
    @Request() req,
  ): Promise<Project> {
    const userId = req.user.sub as number;
    return await this.projectService.update({
      where: { id, user: { id: userId } },
      data: dto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<Project> {
    return this.projectService.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
