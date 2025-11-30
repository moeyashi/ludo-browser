import { literal, object, string, union } from "valibot";
import type { InferInput } from "valibot"

// define the shape of the records that are stored in the Durable Object database
export type LudoRecord = [
  // NOTE: _always_ add id
  string, // id
  string, // title
  number, // created_at
  number, // updated_at
  // NOTE: _always_ add deleted_at
  number | null // deleted_at
];

export const CreateRoom = object({
  type: literal("CreateRoom"),
  title: string(),
})

export type CreateRoom = InferInput<typeof CreateRoom>

export const SendMessage = object({
  type: literal("SendMessage"),
  content: string(),
})

export type SendMessage = InferInput<typeof SendMessage>

export const LudoAction = union([CreateRoom, SendMessage]);
