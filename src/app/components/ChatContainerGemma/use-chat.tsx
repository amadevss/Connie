'use client';

import { useState, useCallback, useRef } from 'react';
import { generateTextResponse, generateImageResponse, generatePDFResponse, summarizeYouTubeVideo } from '@/app/actions/chat';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  mediaUrl?: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pdfContent, setPDFContent] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string, imageBase64?: string) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setIsGenerating(true);
      setError(null);

      // Crear el mensaje del usuario con la imagen si existe
      const userMessage: Message = {
        role: 'user',
        content,
        ...(imageBase64 && { mediaUrl: `data:image/jpeg;base64,${imageBase64}` }),
      };

      // Agregar el mensaje del usuario al historial
      setMessages(prev => [...prev, userMessage]);

      // Crear un nuevo AbortController
      abortControllerRef.current = new AbortController();

      let response;
      if (pdfContent) {
        response = await generatePDFResponse({
          prompt: content,
          pdfContent,
          history: messages,
        });
      } else if (imageBase64) {
        response = await generateImageResponse({
          prompt: content,
          imageBase64,
          history: messages,
        });
      } else {
        response = await generateTextResponse({
          prompt: content,
          history: messages,
        });
      }

      // Agregar la respuesta del asistente
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.text },
      ]);

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Generación cancelada por el usuario');
      } else {
        console.error('Error al enviar mensaje:', error);
        setError(error instanceof Error ? error : new Error('Error desconocido'));
      }
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [messages, pdfContent]);

  const abortGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setInput('');
    setError(null);
    setPDFContent(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const addMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  // Nueva función para resumir videos de YouTube
  const summarizeYouTube = useCallback(async (videoUrl: string, prompt?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      setMessages(prev => [...prev, { role: 'user', content: `Resumir video: ${videoUrl}` }]);
      const response = await summarizeYouTubeVideo({ videoUrl, prompt });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Error al resumir video de YouTube'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    isGenerating,
    error,
    sendMessage,
    abortGeneration,
    clearChat,
    addMessage,
    pdfContent,
    setPDFContent,
    summarizeYouTube,
  };
}
