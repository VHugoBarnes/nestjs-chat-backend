import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Schema as MSchema } from "mongoose";

@Schema()
@ObjectType()
export class User {
  @Prop({ type: MSchema.Types.ObjectId })
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field(() => String)
  name: string;

  @Prop({ unique: true })
  @Field(() => String)
  email: string;

  @Prop()
  password: string;

  @Prop()
  @Field(() => String, { nullable: true })
  profilePhoto: string;

  @Prop({ unique: true })
  @Field(() => String)
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);