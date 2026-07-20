export type AIMessage = {
    role: "user" | "assistant";
    content: string;
  };
  
  export type AIRequest = {
    message: string;
    image?: File | null;
    messages: AIMessage[];
  };
  
  export type AIResponse = {
    reply: string;
  };