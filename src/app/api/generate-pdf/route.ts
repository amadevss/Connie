import { NextResponse } from 'next/server';
import { genkit } from 'genkit/beta';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';

const ai = genkit({
    plugins: [
      googleAI({
        apiKey: process.env.GENKIT_API_KEY,
      }),
    ],
    model: gemini15Flash, // Modelo predeterminado
  });

export async function POST(req: Request) {
  try {
    const { prompt, pdfContent } = await req.json();

    if (!prompt || !pdfContent) {
      return NextResponse.json(
        { error: 'Prompt y contenido del PDF son requeridos' },
        { status: 400 }
      );
    }

    const response = await ai.generate({
      prompt: `Eres un asistente especializado en analizar documentos PDF.
      Contexto del documento:
      ${pdfContent}
      
      Pregunta del usuario: ${prompt}
      
      Por favor, responde basándote en el contenido del PDF.
      Si la pregunta está fuera del contexto del documento, indícalo amablemente.`
    });

    return new Response(response.text, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Error en el chat con PDF:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 