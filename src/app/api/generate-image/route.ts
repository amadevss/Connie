import { NextResponse } from "next/server";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Por favor, proporciona una descripción para la imagen." },
        { status: 400 }
      );
    }

    if (!HUGGINGFACE_API_KEY) {
      console.error("HUGGINGFACE_API_KEY no está configurada en las variables de entorno");
      return NextResponse.json(
        { error: "Error de configuración: API key no encontrada" },
        { status: 500 }
      );
    }

    // Generar la imagen usando Hugging Face
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: "blurry, bad quality, distorted, disfigured",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Error de la API:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Error de autenticación. Por favor, verifica tu API key." },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: `Error de la API: ${response.statusText}` },
        { status: response.status }
      );
    }

    // La respuesta es directamente la imagen en formato blob
    const imageBlob = await response.blob();
    const buffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error generando imagen:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}