import { Avatar } from "@/components/ui/avatar";
import { User, Bot, Maximize2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "./use-chat";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useState, useEffect, useRef } from 'react';
import type { Components } from 'react-markdown';
import Image from "next/image";

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ChatMessage({ message, isLastMessage }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isUser) {
      setDisplayedContent(message.content);
      setIsTyping(false);
      return;
    }

    // Si el mensaje ya está completo y nunca se animó, mostrarlo completo con animación typewriter
    if (message.content && !hasAnimated.current && message.content.length > 0) {
      setDisplayedContent("");
      let currentIndex = 0;
      setIsTyping(true);
      const typingInterval = setInterval(() => {
        if (currentIndex < message.content.length) {
          const chunkSize = 3;
          setDisplayedContent(message.content.slice(0, currentIndex + chunkSize));
          currentIndex += chunkSize;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          hasAnimated.current = true;
        }
      }, 15);
      return () => clearInterval(typingInterval);
    } else if (hasAnimated.current || !message.content) {
      // Si ya se animó o el mensaje está vacío, solo mostrar el contenido actual
      setDisplayedContent(message.content);
      setIsTyping(false);
    }
  }, [message.content, isUser]);

  const markdownComponents: Components = {
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl font-bold mb-4" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl font-bold mb-3" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-bold mb-2" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="mb-3 leading-relaxed text-lg" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-6 mb-3 text-lg" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-6 mb-3 text-lg" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="mb-2" {...props}>
        {children}
      </li>
    ),
    code: ({ inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline ? (
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-base font-mono my-3 overflow-x-auto">
          <code className={match ? `language-${match[1]}` : ''} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-base font-mono" {...props}>
          {children}
        </code>
      );
    },
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-blue-500 hover:text-blue-600 underline text-lg"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-3 text-lg" {...props}>
        {children}
      </blockquote>
    ),
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-3">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-lg" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-4 py-2 border-t border-gray-200 dark:border-gray-700" {...props}>
        {children}
      </td>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5
      }}
      className={cn(
        "flex items-start gap-3 group py-4",
        isUser && "flex-row-reverse",
        isLastMessage && "mb-4"
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.1
        }}
      >
        <Avatar 
          className={cn(
            "flex justify-center items-center h-8 w-8 transition-transform duration-200",
            isUser ? "bg-slate-700" : "bg-indigo-600",
            "group-hover:scale-110"
          )}
        >
          {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
        </Avatar>
      </motion.div>
      <motion.div
        initial={{ x: isUser ? 20 : -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: 0.2
        }}
        className={cn(
          "rounded-2xl p-4 min-w-[200px] max-w-[85%] shadow-sm transition-all duration-200",
          isUser
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            : "text-gray-800 dark:text-gray-100"
        )}
      >
        {message.mediaUrl && (
          <div className="relative w-48 h-48 mb-4 group/image">
            <Image
              src={message.mediaUrl}
              alt="Imagen adjunta"
              fill
              className="object-contain rounded-lg cursor-pointer"
              onClick={() => setShowImageModal(true)}
            />
            <button
              className="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/80 rounded-full p-1 shadow hover:bg-white dark:hover:bg-gray-800 transition z-10"
              onClick={() => setShowImageModal(true)}
              title="Ampliar imagen"
              type="button"
            >
              <Maximize2 className="h-5 w-5 text-indigo-600" />
            </button>
            {showImageModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-2xl max-w-3xl w-full flex flex-col items-center">
                  <button
                    className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-800 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                    onClick={() => setShowImageModal(false)}
                    title="Cerrar"
                  >
                    <span className="text-lg">✕</span>
                  </button>
                  <img
                    src={message.mediaUrl}
                    alt="Imagen generada"
                    className="max-h-[70vh] w-auto rounded-lg mb-4"
                  />
                  <a
                    href={message.mediaUrl}
                    download={"imagen-generada.png"}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                  >
                    <Download className="h-5 w-5" /> Descargar
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="prose dark:prose-invert max-w-none min-h-[24px]">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={markdownComponents}
          >
            {displayedContent}
          </ReactMarkdown>
          {isTyping && (
            <span className="inline-block w-2 h-5 bg-gray-400 dark:bg-gray-500 animate-pulse ml-1" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
