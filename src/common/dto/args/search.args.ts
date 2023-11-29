import { ArgsType, Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import validator from "validator";

@ArgsType()
export class SearchArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Transform((params: { value: string }) => validator.escape(params.value.trim()))
  search?: string = "";
}