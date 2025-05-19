interface RequestBody {
  prompt: string;
  media?: { url: string };
  history: Array<{
    role: "user" | "assistant";
    content: string;
    mediaUrl?: string;
  }>;
  options: {
    format: string;
    temperature: number;
    maxTokens: number;
    stream: boolean;
  };
}

interface GenerateImageOptions {
  prompt: string;
  model?: "imagen2" | "imagen3";
  size?: "256x256" | "512x512" | "1024x1024";
  signal?: AbortSignal;
}

export class AIService {
  private static instance: AIService;
  private readonly API_URL = "/api/generate";
  private readonly IMAGE_API_URL = "/api/generate-image";

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public async generateResponse(prompt: string, mediaUrl?: string, history: Array<{role: "user" | "assistant", content: string, mediaUrl?: string}> = [], signal?: AbortSignal): Promise<Response> {
    try {
      const requestBody: RequestBody = {
        prompt,
        history,
        options: {
          format: "markdown",
          temperature: 0.7,
          maxTokens: 1000,
          stream: true
        }
      };

      if (mediaUrl) {
        requestBody.media = {
          url: mediaUrl
        };
      }

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate response");
      }

      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }

  public async generateImage(options: GenerateImageOptions): Promise<string> {
    try {
      const response = await fetch(this.IMAGE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: options.prompt,
          model: options.model || "imagen3",
          size: options.size || "512x512"
        }),
        signal: options.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }

  private formatMarkdownResponse(text: string): string {
    // Asegurar que los bloques de código estén correctamente formateados
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `\`\`\`${lang || ''}\n${code.trim()}\n\`\`\``;
    });

    // Asegurar que los enlaces estén correctamente formateados
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      return `[${text}](${url})`;
    });

    // Asegurar que las listas tengan el formato correcto
    text = text.replace(/^[-*+]\s+/gm, '- ');

    return text;
  }
}
