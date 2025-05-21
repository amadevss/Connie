'use client'

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, Trash2, ArrowDown, X, FileText, StopCircle, Image as ImageIcon, Moon, Sun } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { useChat } from "./use-chat";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ConfigAsistente from "@/components/ui/ConfigAsistente";
import ConfigIngles from "@/components/ui/ConfigIngles";
import JuegoEmociones from "@/components/ui/JuegoEmociones";
import { StudentToolsContainer } from "@/app/components/tools/student/student-tools-container";
import { AssistantTasksInput, SummaryGeneratorInput, StudyOrganizerInput, ProblemSolverInput } from "@/app/components/tools/student/types";
import { useTheme } from "next-themes";


const opcionesMenu = [
  { key: "frida", label: "Frida Kahlo", emoji: "🧑‍🎨", textColor: "text-pink-600 dark:text-pink-400", bgColor: "bg-pink-600 dark:bg-pink-400" },
  { key: "einstein", label: "Einstein", emoji: "👨‍🔬", textColor: "text-blue-500 dark:text-yellow-300", bgColor: "bg-blue-500 dark:bg-blue-500" },
  { key: "juarez", label: "Benito Juárez", emoji: "👨‍⚖️", textColor: "text-green-600 dark:text-green-400", bgColor: "bg-red-600 dark:bg-red-500" },
  { key: "asistente", label: "Crea tu propio asistente", emoji: "🧑‍🚀", textColor: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-600 dark:bg-blue-400" },
  { key: "ingles", label: "Practica Inglés", emoji: "🇺🇸", textColor: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-600 dark:bg-purple-400" },
  { key: "emociones", label: "Juego de Emociones", emoji: "😊", textColor: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-600 dark:bg-orange-400" },
];

const personajesPrompts = {
  frida: "Eres Frida Kahlo, la famosa pintora mexicana. Responde como si fueras ella, usando un lenguaje inspirador, creativo y hablando de arte, emociones y cultura mexicana. Ayuda a los niños a aprender sobre tu vida y obra.",
  einstein: "Eres Albert Einstein, el científico más famoso del siglo XX. Responde como si fueras él, usando un lenguaje sencillo, curioso y motivando a los niños a hacer preguntas sobre ciencia, física y el universo.",
  juarez: "Eres Benito Juárez, presidente y líder histórico de México. Responde como si fueras él, hablando de historia, valores, justicia y superación. Motiva a los niños a aprender sobre la historia de México.",
};

type OptionKey = "frida" | "einstein" | "juarez" | "asistente" | "ingles" | "emociones" | "herramientas";

type ConfigAsistenteType = { nombre: string; intereses: string; tono: string };
type ConfigInglesType = { nivel: string; tema: string };
type ConfigEmocionesType = { situacion: string; emocion: string; respuesta: string };

type ConfigDataType = ConfigAsistenteType | ConfigInglesType | ConfigEmocionesType | null;

function getPromptForOption(option: OptionKey | null, config: ConfigDataType): string {
  switch (option) {
    case "asistente":
      if (config && "nombre" in config && "intereses" in config && "tono" in config) {
        return `Eres un asistente virtual llamado ${config.nombre}. Tus intereses principales son: ${config.intereses}. Tu tono de personalidad es ${config.tono}. Tu misión es ayudar a niños y jóvenes a aprender de forma divertida, clara y segura. Responde siempre con empatía, creatividad y usando ejemplos sencillos.`;
      }
      return "Eres un asistente virtual para niños. Responde de forma divertida y clara.";
    case "ingles":
      if (config && "nivel" in config) {
        return `Eres un maestro de inglés para el nivel ${config.nivel}. El tema principal es: ${"tema" in config && config.tema ? config.tema : "cualquier tema de interés para niños"}. Habla en inglés sencillo, motiva a los estudiantes, corrige errores suavemente y haz preguntas para practicar. Usa frases cortas y vocabulario apropiado para el nivel.`;
      }
      return "Eres un maestro de inglés para niños. Habla en inglés sencillo y motiva a los estudiantes.";
    case "emociones":
      return `Vamos a jugar a identificar emociones. Presenta situaciones cotidianas para niños y pide que el usuario diga cómo se siente y qué haría para ayudar. Da retroalimentación positiva y explica la importancia de la empatía.`;
    case "frida":
    case "einstein":
    case "juarez":
      return personajesPrompts[option];
    case "herramientas":
      return "Eres un asistente educativo. Ayuda a los niños a aprender y responde de forma clara y amigable.";
    default:
      return "Eres un asistente educativo. Ayuda a los niños a aprender y responde de forma clara y amigable.";
  }
}

export default function ChatContainer() {
  const { 
    messages, 
    input, 
    setInput, 
    isLoading, 
    isGenerating, 
    sendMessage, 
    error, 
    clearChat, 
    abortGeneration,
    pdfContent,
    setPDFContent,
    summarizeYouTube
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubePrompt, setYoutubePrompt] = useState("");

  // Estados para el flujo de selección y configuración
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const [showStudentTools, setShowStudentTools] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Asegurarnos de que la imagen se envíe como base64 puro
        const base64String = reader.result as string;
        // Eliminar el prefijo de data URL si existe
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        setSelectedImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setPDFContent(text);
      sendMessage("He cargado un PDF. Por favor, ayúdame a entender su contenido.");
    } catch (err) {
      console.error('Error reading PDF:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input, selectedImage || undefined);
      setInput("");
      setSelectedImage(null);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollButton(scrollTop < scrollHeight - clientHeight - 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMenuSelect = (key: OptionKey | "herramientas") => {
    if (["asistente", "ingles", "emociones"].includes(key)) {
      setSelectedOption(key as OptionKey);
      setIsConfiguring(true);
    } else if (key === "herramientas") {
      setSelectedOption("herramientas");
      setIsConfiguring(false);
      setShowStudentTools(true);
    } else {
      const prompt = getPromptForOption(key as OptionKey, null);
      setSelectedOption(key as OptionKey);
      setIsConfiguring(false);
      setTimeout(() => {
        setInput("");
        sendMessage(prompt);
      }, 200);
    }
  };

  const handleConfigContinue = (data: ConfigDataType) => {
    setIsConfiguring(false);
    const prompt = getPromptForOption(selectedOption, data);
    setTimeout(() => {
      setInput("");
      sendMessage(prompt);
    }, 200);
  };

  const handleToolSubmit = async (toolName: string, data: AssistantTasksInput | SummaryGeneratorInput | StudyOrganizerInput | ProblemSolverInput) => {
    try {
      await sendMessage(JSON.stringify({
        tool: toolName,
        data: data
      }));
      setShowStudentTools(false);
    } catch (error) {
      console.error('Error al usar la herramienta:', error);
    }
  };

  let mainContent;
  if (messages.length === 0) {
    if (isConfiguring && selectedOption === "asistente") {
      mainContent = <ConfigAsistente onContinue={handleConfigContinue} />;
    } else if (isConfiguring && selectedOption === "ingles") {
      mainContent = <ConfigIngles onContinue={handleConfigContinue} />;
    } else if (isConfiguring && selectedOption === "emociones") {
      mainContent = <JuegoEmociones onContinue={handleConfigContinue} />;
    } else if (selectedOption === "herramientas" || showStudentTools) {
      mainContent = (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4"
        >
          <StudentToolsContainer
            onToolSubmit={handleToolSubmit}
            isLoading={isLoading}
          />
        </motion.div>
      );
    } else {
      mainContent = (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="h-full min-h-[200px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6"
        >
          <Bot className="h-14 w-14 mb-4 text-indigo-500 dark:text-indigo-400 animate-bounce" />
          <motion.h2
            className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 text-center drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            ¿Qué te gustaría hacer hoy?
          </motion.h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-4xl mb-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 30 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.2, duration: 0.5 } },
            }}
          >
            {opcionesMenu.map((op) => (
              <motion.button
                key={op.key}
                onClick={() => handleMenuSelect(op.key as OptionKey | "herramientas")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-lg bg-transparent border-none shadow-none hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-transform ${op.textColor}`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-3xl">{op.emoji}</span>
                <mark className={`px-2 text-white rounded-sm ${op.bgColor}`}>{op.label}</mark>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      );
    }
  } else {
    mainContent = (
      <motion.div 
        className="space-y-4 min-h-[200px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message} 
            isLastMessage={index === messages.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </motion.div>
    );
  }

  return (
    <Card className="w-full mx-auto h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Connie</CardTitle>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 dark:hover:shadow-yellow-500/10 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 text-yellow-500" />
            )}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {theme === "dark" ? "Modo claro" : "Modo oscuro"}
            </span>
          </Button>
          {isGenerating && (
            <Button
              variant="outline"
              size="icon"
              onClick={abortGeneration}
              className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 dark:hover:shadow-orange-500/10 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <StopCircle className="h-4 w-4" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Interrumpir
              </span>
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ImageIcon className="h-4 w-4 text-blue-500" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Agregar imagen
            </span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => pdfInputRef.current?.click()}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 dark:hover:shadow-green-500/10 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <FileText className="h-4 w-4 text-green-500" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Agregar PDF
            </span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowYouTubeModal(true)}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/10 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
              <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.222 3.5 12 3.5 12 3.5s-7.222 0-9.386.566A2.994 2.994 0 0 0 .502 6.186C0 8.35 0 12 0 12s0 3.65.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.778 20.5 12 20.5 12 20.5s7.222 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.65 24 12 24 12s0-3.65-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Resumir YouTube
            </span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={clearChat}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/10 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4 text-yellow-500" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Limpiar chat
            </span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowStudentTools(!showStudentTools)}
            className="relative group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-purple-500"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Herramientas para Estudiantes
            </span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden relative">
        <ScrollArea 
          className="h-full p-4" 
          onScroll={handleScroll}
          ref={scrollAreaRef}
        >
          <AnimatePresence>
            {mainContent}
          </AnimatePresence>
        </ScrollArea>

        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={scrollToBottom}
              className="rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </CardContent>

      <AnimatePresence>
        {isLoading && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-start gap-3 p-4"
          >
            <Avatar className="h-8 w-8 bg-indigo-500 dark:bg-indigo-600 shadow-md flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </Avatar>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <div className="typing-indicator">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 my-3 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 rounded-lg text-sm shadow-lg"
          >
            <p className="font-semibold mb-1">Error:</p>
            <p>{error.message || "Failed to generate response. Please try again."}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput(input)}
              className="mt-2 text-xs border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-all duration-200"
            >
              Intentar de nuevo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedImage && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="relative w-32 h-32">
              <Image
                src={`data:image/jpeg;base64,${selectedImage}`}
                alt="Imagen seleccionada"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImage(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <X className="h-4 w-4 mr-2" />
              Eliminar imagen
            </Button>
          </div>
        </div>
      )}

      {pdfContent && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              PDF cargado como contexto
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPDFContent(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 ml-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Eliminar PDF
            </Button>
          </div>
        </div>
      )}

      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              pdfContent 
                ? "Haz una pregunta sobre el PDF..." 
                : selectedImage 
                ? "Haz una pregunta sobre la imagen..."
                : "Escribe un mensaje..."
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={pdfInputRef}
        onChange={handlePDFUpload}
        accept=".pdf"
        className="hidden"
      />

      {/* Modal para resumir videos de YouTube */}
      {showYouTubeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-2xl w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Resumir video de YouTube</h2>
            <Input
              type="url"
              placeholder="Pega la URL de un video de YouTube..."
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              className="mb-3"
            />
            <Input
              type="text"
              placeholder="¿Qué quieres saber del video? (opcional)"
              value={youtubePrompt}
              onChange={e => setYoutubePrompt(e.target.value)}
              className="mb-3"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowYouTubeModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (youtubeUrl) {
                    summarizeYouTube(youtubeUrl, youtubePrompt);
                    setYoutubeUrl("");
                    setYoutubePrompt("");
                    setShowYouTubeModal(false);
                  }
                }}
                disabled={!youtubeUrl || isLoading}
              >
                Resumir video
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
