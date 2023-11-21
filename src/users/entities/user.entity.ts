import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Field, ObjectType } from "@nestjs/graphql";

@Schema()
@ObjectType()
export class User {
  @Prop({ required: true })
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => String)
  email: string;

  @Prop()
  password: string;

  @Prop()
  @Field(() => String)
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);