import { NextResponse } from "next/server";
import { gemini15Flash, googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";

// Configurar instancia de Genkit con Google AI
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GENKIT_API_KEY,
    }),
  ],
  model: gemini15Flash, // Modelo predeterminado
});

// Función para generar el prompt
function generatePrompt(
  prompt: string,
  config: { role: string; tone: string; context: string },
  mediaUrl?: string,
  history?: string
) {
  let basePrompt = `
    Responde como "${config.role}", un asistente educativo diseñado para ayudar a estudiantes de preescolar, primaria y secundaria.
    Explica los temas de forma clara, con ejemplos sencillos y con buena gramática.
    Mantén un tono ${config.tone} y evita temas fuera del ámbito escolar.

    ${config.context}

    ${history ? `\nContexto de la conversación anterior:\n${history}` : ''}
  `;

  if (mediaUrl) {
    basePrompt += `\nAnaliza la imagen proporcionada y responde a la siguiente pregunta: "${prompt}"`;
  } else {
    basePrompt += `\nPregunta del estudiante: "${prompt}"`;
  }

  return basePrompt;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const prompt: string = body.prompt;
    const mediaUrl: string | undefined = body.media?.url;
    const history = body.history || [];
    const config = body.config || {
      role: "Connie",
      tone: "amigable y educativo",
      context: ""
    };

    if (!prompt) {
      return NextResponse.json(
        { error: "Por favor, ingresa una pregunta." },
        { status: 400 }
      );
    }

    // Construir el contexto con el historial
    const contextWithHistory = history
      .map((msg: {role: string, content: string}) => `${msg.role === 'user' ? 'Estudiante' : 'Asistente'}: ${msg.content}`)
      .join('\n');

    const studentPrompt = generatePrompt(
      prompt,
      config,
      mediaUrl,
      contextWithHistory
    );

    // Generar respuesta con el modelo de AI
    const { stream } = await ai.generateStream(
      mediaUrl
        ? [{ media: { url: mediaUrl } }, { text: studentPrompt }]
        : [{ text: studentPrompt }]
    );

    // Crear un ReadableStream para enviar los datos en streaming
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk.text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generando texto:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
