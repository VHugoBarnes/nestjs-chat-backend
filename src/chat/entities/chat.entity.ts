import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { Schema as MSchema } from "mongoose";

@Schema({ timestamps: true })
@ObjectType()
export class Chat {
  @Prop({ type: MSchema.Types.ObjectId })
  @Field(() => ID)
  _id: string;

  name: string;

  slug: string;

  members: string[];

  createdAt?: Date;

  updatedAt?: Date;
}
