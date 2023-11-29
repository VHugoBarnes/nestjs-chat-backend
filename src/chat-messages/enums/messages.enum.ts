import { registerEnumType } from "@nestjs/graphql";

export enum MessagesTypes {
  text,
  picture,
  video
};

registerEnumType(MessagesTypes, { name: "MessagesType" });