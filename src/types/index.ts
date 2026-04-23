// src/types/index.ts

export interface AuthResponse {
  token: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string | null;
}

export interface ChatResponse {
  reply: string;
  conversationId: string;
}

export interface Message {
  role: "user" | "ai";
  content: string;
}