import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';
import { AuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
