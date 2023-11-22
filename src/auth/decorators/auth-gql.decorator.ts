import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth-gql.guard";

export function AuthQql() {
  return applyDecorators(
    UseGuards(JwtAuthGuard)
  );
}