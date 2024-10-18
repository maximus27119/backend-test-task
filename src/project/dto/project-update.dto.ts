import { ProjectStatus } from '@prisma/client';

export type ProjectUpdate = {
  name?: string;
  url?: string;
  status?: ProjectStatus;
  expiredAt?: Date;
};
