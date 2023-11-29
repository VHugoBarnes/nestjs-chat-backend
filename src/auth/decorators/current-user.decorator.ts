import { ExecutionContext, InternalServerErrorException, Logger, NotFoundException, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ContextType } from "../../common/enums/context-type.enum";
import { User } from "../../users/entities/user.entity";

export const CurrentUser = createParamDecorator((data: ContextType = ContextType.http, context: ExecutionContext) => {
  const logger = new Logger("CurrentUser-Decorator");
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
      user = ctx.getContext().req?.user;
      break;
    default:
      throw new InternalServerErrorException("[invalid-context]");
  }

  if (!user) {
    logger.error("User not found, perhaps no @AuthHttp/@AuthGql decorator placed?");
    throw new NotFoundException("[user-not-found]");
  };

  return user;
});