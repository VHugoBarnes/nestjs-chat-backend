import { registerEnumType } from "@nestjs/graphql";

export enum MessagesTypes {
  text = "text",
  picture = "picture",
  video = "video"
};

registerEnumType(MessagesTypes, { name: "MessagesType" });