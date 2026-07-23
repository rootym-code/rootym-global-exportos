// components/r-captain/types.ts

export type MessageRole = "user" | "assistant";

export interface Message {
  role: MessageRole;
  content: string;
}

 