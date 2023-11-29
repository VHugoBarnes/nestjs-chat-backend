import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Schema as MSchema } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

@Schema()
@ObjectType()
export class User {
  @Prop({ type: MSchema.Types.ObjectId })
  @Field(() => ID)
  @ApiProperty()
  _id: string;

  @Prop({ required: true })
  @Field(() => String)
  @ApiProperty()
  name: string;

  @Prop({ unique: true })
  @Field(() => String)
  @ApiProperty()
  email: string;

  @Prop()
  @ApiProperty()
  password: string;

  @Prop()
  @Field(() => String, { nullable: true })
  @ApiProperty()
  profilePhoto: string;

  @Prop({ unique: true })
  @Field(() => String)
  @ApiProperty()
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);