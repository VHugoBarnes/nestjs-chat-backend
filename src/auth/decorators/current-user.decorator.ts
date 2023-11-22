import { ExecutionContext, InternalServerErrorException, NotFoundException, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ContextType } from "src/common/enums/context-type.enum";
import { User } from "src/users/entities/user.entity";

export const CurrentUser = createParamDecorator((data: ContextType = ContextType.http, context: ExecutionContext) => {
  let ctx;
  let user: User;

  switch (data) {
    case ContextType.http:
      ctx = context.switchToHttp().getRequest();
      user = ctx.user;
      break;
    case ContextType.websocket:
      ctx = context.switchToWs().getData();
      user = ctx.user;
      break;
    case ContextType.graphql:
      ctx = GqlExecutionContext.create(context);
      console.log(ctx.getContext().req);
      user = ctx.getContext().req?.user;
      break;
    default:
      throw new InternalServerErrorException("[invalid-context]");
  }

  if (!user) throw new NotFoundException("[user-not-found]");

  return user;
});