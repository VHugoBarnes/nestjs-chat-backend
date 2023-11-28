import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MSchema } from "mongoose";
import { User } from "src/users/entities/user.entity";

@Schema({ timestamps: true })
@ObjectType()
export class Chat {
  @Prop({ type: MSchema.Types.ObjectId })
  @Field(() => ID)
  _id: string;

  @Prop({ type: String })
  @Field(() => String)
  name: string;

  @Prop({ type: String })
  @Field(() => String)
  room_id: string;

  @Prop({ type: [MSchema.Types.ObjectId], ref: "users" })
  @Field(() => [User])
  members: string[];

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
