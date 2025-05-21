"use server";

import { genkit } from "genkit/beta";
import { gemini15Flash, googleAI } from "@genkit-ai/googleai";
import { z } from "zod";

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GENKIT_API_KEY,
    }),
  ],
  model: gemini15Flash,
});

// Esquema para la entrada de texto
const textInputSchema = z.object({
  prompt: z.string(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      mediaUrl: z.string().optional(),
    })
  ),
});

// Esquema para la entrada de imagen
const imageInputSchema = z.object({
  prompt: z.string(),
  imageBase64: z.string(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      mediaUrl: z.string().optional(),
    })
  ),
});

// Esquema para la entrada de PDF
const pdfInputSchema = z.object({
  prompt: z.string(),
  pdfContent: z.string(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

// Esquema para la entrada de YouTube
const youtubeInputSchema = z.object({
  videoUrl: z.string().url(),
  prompt: z.string().optional(),
});

// Función para chat de texto
export async function generateTextResponse(
  input: z.infer<typeof textInputSchema>
) {
  try {
    const { prompt, history } = textInputSchema.parse(input);

    const response = await ai.generate({
      prompt: `Contexto de la conversación:
      ${history.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}

      Pregunta del usuario: ${prompt}

      Por favor, responde de manera clara y concisa.`,
    });

    return { text: response.text };
  } catch (error) {
    console.error("Error en generateTextResponse:", error);
    throw new Error("Error al generar respuesta de texto");
  }
}

// Función para chat con imagen
export async function generateImageResponse(
  input: z.infer<typeof imageInputSchema>
) {
  try {
    const { prompt, imageBase64, history } = imageInputSchema.parse(input);

    const response = await ai.generate([
      {
        text: `Contexto de la conversación:
        ${history.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}
        Pregunta del usuario sobre la imagen: ${prompt}`,
      },
      {
        media: {
          url: `data:image/jpeg;base64,${imageBase64}`,
          contentType: "image/jpeg",
        },
      },
    ]);

    return { text: response.text };
  } catch (error) {
    console.error("Error en generateImageResponse:", error);
    throw new Error("Error al generar respuesta con imagen");
  }
}

// Función para chat con PDF
export async function generatePDFResponse(
  input: z.infer<typeof pdfInputSchema>
) {
  try {
    const { prompt, pdfContent, history } = pdfInputSchema.parse(input);

    const response = await ai.generate({
      prompt: `Eres un asistente especializado en analizar documentos PDF.
      Contexto del documento:
      ${pdfContent}
      
      Historial de la conversación:
      ${history.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}
      
      Pregunta del usuario: ${prompt}
      
      Por favor, responde basándote en el contenido del PDF.
      Si la pregunta está fuera del contexto del documento, indícalo amablemente.`,
    });

    return { text: response.text };
  } catch (error) {
    console.error("Error en generatePDFResponse:", error);
    throw new Error("Error al generar respuesta con PDF");
  }
}

// Función para resumir videos de YouTube
export async function summarizeYouTubeVideo(
  input: z.infer<typeof youtubeInputSchema>
) {
  try {
    const { videoUrl, prompt } = youtubeInputSchema.parse(input);

    const response = await ai.generate({
      prompt: [
        { text: prompt || "Resume el siguiente video de YouTube:" },
        { media: { url: videoUrl, contentType: "video/mp4" } }
      ],
    });

    return { text: response.text };
  } catch (error) {
    console.error("Error al resumir video de YouTube:", error);
    throw new Error("Error al resumir video de YouTube");
  }
}
