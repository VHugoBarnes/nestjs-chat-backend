import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth-gql.guard";

export function AuthGql() {
  return applyDecorators(
    UseGuards(JwtAuthGuard)
  );
}