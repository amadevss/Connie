export interface Message {
  role: "user" | "assistant";
  content: string;
  mediaUrl?: string;
}
