export interface Message {
  id: string;
  role: "user" | "assistant";
  content: any;
  timestamp: Date;
  status?: "streaming" | "done";
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  conversationId: string | null;
  timestamp: Date;
}
