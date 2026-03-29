import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface RequestWithUser {
  user?: {
    role?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // Check if user exists and has role
    if (!user || !user.role) {
      return false;
    }

    // Check if user's role matches any of the required roles
    return requiredRoles.some((role) => user.role === role);
  }
}
