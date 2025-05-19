import type { Message } from "./chat"
import { useState, useCallback, useRef } from "react";
import { AIService } from "./ai-service";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (prompt: string, mediaUrl?: string) => {
    setIsLoading(true);
    setIsGenerating(false);
    setError(null);

    const userMessage: Message = { 
      role: "user", 
      content: prompt,
      mediaUrl 
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Crear y guardar el AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await AIService.getInstance().generateResponse(
        prompt, 
        mediaUrl,
        messages,
        abortController.signal
      );

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content = accumulatedContent;
          } else {
            updatedMessages.push({ role: "assistant", content: accumulatedContent });
          }
          return updatedMessages;
        });

        setIsGenerating(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        // Cancelado por el usuario, no hacer nada especial
      } else {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error("Error in chat:", error);
      }
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [messages]);

  const abortGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const addMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    isGenerating,
    sendMessage,
    error,
    clearChat,
    addMessage,
    abortGeneration,
  };
}
