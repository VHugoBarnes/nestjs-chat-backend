import { ExecutionContext, UnauthorizedException, createParamDecorator } from "@nestjs/common";

export const GetJwt = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const token: string = request.headers.authorization?.replace("Bearer ", "");

  if (!token) throw new UnauthorizedException("[jwt-not-found]");

  return token;
});