'use client'

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Send, Bot, Loader2, Trash2, ArrowDown, X, Camera, Image as ImageIcon } from "lucide-react";
import { Send, Bot, Trash2, ArrowDown, X, Camera } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { useChat } from "./use-chat";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ConfigAsistente from "@/components/ui/ConfigAsistente";
import ConfigIngles from "@/components/ui/ConfigIngles";
import JuegoEmociones from "@/components/ui/JuegoEmociones";
// import { AIService } from "./ai-service";
// import { BLACKLIST, BLACKLIST_REGEX } from "./blacklist";

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

type OptionKey = "frida" | "einstein" | "juarez" | "asistente" | "ingles" | "emociones";

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
    default:
      return "Eres un asistente educativo. Ayuda a los niños a aprender y responde de forma clara y amigable.";
  }
}

export default function ChatContainer() {
  const { messages, input, setInput, isLoading, isGenerating, sendMessage, error, clearChat, abortGeneration } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  // const [imagePrompt, setImagePrompt] = useState("");
  // const [showImagePrompt, setShowImagePrompt] = useState(false);
  // const [imageAbortController, setImageAbortController] = useState<AbortController | null>(null);
  // const [imageWarning, setImageWarning] = useState("");

  // Estados para el flujo de selección y configuración
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  // function normalizePrompt(text: string) {
  //   return text
  //     .toLowerCase()
  //     .normalize("NFD")
  //     .replace(/[\u0300-\u036f]/g, "") // quitar tildes
  //     .replace(/[^a-z0-9\s]/gi, "") // quitar símbolos
  //     .replace(/\s+/g, " ") // espacios simples
  //     .trim();
  // }

  // const handleGenerateImage = async () => {
  //   if (!imagePrompt.trim()) return;
  //   // Validar contra la blacklist y regex
  //   const promptNorm = normalizePrompt(imagePrompt);
  //   const found = BLACKLIST.some(word => promptNorm.includes(word));
  //   const foundRegex = BLACKLIST_REGEX.some(rx => rx.test(promptNorm));
  //   if (found || foundRegex) {
  //     setImageWarning("El contenido de tu solicitud no es apropiado para un entorno educativo. Por favor, utiliza solo descripciones seguras y aptas para estudiantes.");
  //     return;
  //   } else {
  //     setImageWarning("");
  //   }
  //   setIsGeneratingImage(true);
  //   const abortController = new AbortController();
  //   setImageAbortController(abortController);
  //   try {
  //     // Generar la imagen
  //     const imageUrl = await AIService.getInstance().generateImage({
  //       prompt: imagePrompt,
  //       size: "512x512",
  //       signal: abortController.signal
  //     });
  //     // Solo si fue exitoso, agregar ambos mensajes
  //     addMessage({ role: "user", content: imagePrompt });
  //     addMessage({ role: "assistant", content: "", mediaUrl: imageUrl });
  //     setImagePrompt("");
  //     setShowImagePrompt(false);
  //   } catch (error: unknown) {
  //     if (error instanceof DOMException && error.name === "AbortError") {
  //       // Cancelado por el usuario, no hacer nada
  //     } else {
  //       console.error("Error generating image:", error);
  //     }
  //   } finally {
  //     setIsGeneratingImage(false);
  //     setImageAbortController(null);
  //   }
  // };

  // const handleCancelImageGeneration = () => {
  //   if (imageAbortController) {
  //     imageAbortController.abort();
  //   }
  //   setShowImagePrompt(false);
  //   setIsGeneratingImage(false);
  // };

  // Reiniciar flujo al limpiar chat
  const handleClearChat = () => {
    clearChat();
    setSelectedOption(null);
    setIsConfiguring(false);
  };

  // Cuando el usuario selecciona una opción del menú
  const handleMenuSelect = (key: OptionKey) => {
    if (["asistente", "ingles", "emociones"].includes(key)) {
      setSelectedOption(key);
      setIsConfiguring(true);
    } else {
      const prompt = getPromptForOption(key, null);
      setSelectedOption(key);
      setIsConfiguring(false);
      setTimeout(() => {
        setInput("");
        sendMessage(prompt);
      }, 200);
    }
  };

  // Cuando termina la configuración
  const handleConfigContinue = (data: ConfigDataType) => {
    setIsConfiguring(false);
    const prompt = getPromptForOption(selectedOption, data);
    setTimeout(() => {
      setInput("");
      sendMessage(prompt);
    }, 200);
  };

  // Menú central, configuración o chat
  let mainContent;
  if (messages.length === 0) {
    if (isConfiguring && selectedOption === "asistente") {
      mainContent = <ConfigAsistente onContinue={handleConfigContinue} />;
    } else if (isConfiguring && selectedOption === "ingles") {
      mainContent = <ConfigIngles onContinue={handleConfigContinue} />;
    } else if (isConfiguring && selectedOption === "emociones") {
      mainContent = <JuegoEmociones onContinue={handleConfigContinue} />;
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
                onClick={() => handleMenuSelect(op.key as OptionKey)}
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
    <Card className="w-full h-full flex flex-col border-0 pb-0">
      <CardHeader className="shrink-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <CardTitle className="text-gray-700 dark:text-white text-2xl font-bold">
              Connie
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
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
          <div className="relative w-32 h-32">
            <Image
              src={selectedImage}
              alt="Imagen seleccionada"
              fill
              className="object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800 rounded-b-2xl shrink-0">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            disabled={isLoading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="text-white shrink-0 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500 shadow-md transition-all duration-200 rounded-lg"
            title="Subir imagen"
          >
            Usar imagen
            <Camera className="h-4 w-4" />
          </Button>
          {/*
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowImagePrompt(true)}
            className="shrink-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-500 dark:hover:to-emerald-500 shadow-md transition-all duration-200 rounded-lg"
            title="Generar imagen"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          */}
          {!(isLoading || isGenerating) && (
            <Button
              type="submit"
              disabled={!input.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500 shadow-md transition-all duration-200 rounded-lg"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          )}
          {(isLoading || isGenerating) && (
            <Button
              type="button"
              variant="destructive"
              onClick={abortGeneration}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 dark:from-red-600 dark:to-pink-600 dark:hover:from-red-500 dark:hover:to-pink-500 shadow-md transition-all duration-200 rounded-lg flex items-center justify-center"
              title="Detener generación"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
      </CardFooter>

      {/*
      <AnimatePresence>
        {showImagePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-center">Generar Imagen</h2>
              {imageWarning && (
                <div className="text-red-600 text-sm mb-2 font-semibold text-center">
                  {imageWarning}
                </div>
              )}
              <Input
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe la imagen que quieres generar..."
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 transition-all duration-200 mb-4"
                disabled={isGeneratingImage}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancelImageGeneration}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !imagePrompt.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-500 dark:hover:to-emerald-500 shadow-md transition-all duration-200"
                >
                  {isGeneratingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Generar Imagen"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      */}
    </Card>
  );
}
