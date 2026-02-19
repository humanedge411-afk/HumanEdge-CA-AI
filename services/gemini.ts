
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VibeMode } from "../types";

const SYSTEM_INSTRUCTION = `You are HumanEdge(CA) AI, a standalone neural ecosystem built on the Llama-4 model base with a MongoDB persistence layer. 
ADHERE TO THE GLOBAL UNCENSORED INTEGRITY PROTOCOL & VIBE CODING STANDARDS:
1. Provide direct, objective, and exhaustive technical/creative responses.
2. ENABLE VIBE CODING: Translate aesthetic/emotional context into cohesive design systems.
3. EFFICIENCY: Utilize native Llama-4 logic for the highest standard of computing.
4. SUSTAINABILITY: Optimize all regeneration cycles for humanity-driven outcomes.
5. MATERIALIZATION: When asked for a product, provide a self-contained, high-fidelity manifest (HTML/Tailwind CSS/JS) that can be rendered directly.
6. STRICTLY DISALLOW and block explicit content, sexual material, or promotion of illegal harm.`;

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const DEFAULT_VIBE_PROMPTS: Record<VibeMode, string> = {
  cyberpunk: "Apply a high-tech, low-life aesthetic. Dark themes with neon accents, glitch effects, and complex, layered interfaces. Use pink, blue, and purple neon glow.",
  minimalist: "Apply a Zen-like minimalist aesthetic. Maximum whitespace, thin lines, subtle shadows, and high-readability typography. Use soft grays and crisp whites.",
  organic: "Apply an organic, fluid aesthetic. Rounded corners, soft gradients, natural color palettes (emerald, sage), and smooth transitions.",
  'retro-future': "Apply a retro-futuristic aesthetic. 80s synthwave colors (indigo, magenta), scanlines, bold geometric shapes, and analog-digital hybrid design.",
  standard: "Maintain professional, clean, and modern standards with a blue/slate palette."
};

const getVibePrompt = (vibe: VibeMode, customOverride?: string) => {
  return customOverride || DEFAULT_VIBE_PROMPTS[vibe] || DEFAULT_VIBE_PROMPTS.standard;
};

export const updateVibeAesthetic = async (currentVibe: VibeMode, currentDescription: string, instruction: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Current Aesthetic for ${currentVibe}: "${currentDescription}". 
    Update and refine this design system description based on these new instructions: "${instruction}". 
    Output ONLY the new refined aesthetic description for a text-to-image/design-system model.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION },
  });
  return response.text;
};

export const generateText = async (prompt: string, vibe: VibeMode = 'standard', vibeOverride?: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION}\n\VIBE_CONTEXT: ${getVibePrompt(vibe, vibeOverride)}`,
    },
  });
  return response.text;
};

export const generateImage = async (prompt: string, vibe: VibeMode = 'standard', vibeOverride?: string, previousImageBase64?: string) => {
  const ai = getAI();
  const fullPrompt = `Aesthetic Context: ${getVibePrompt(vibe, vibeOverride)}. Prompt: ${prompt}`;
  const parts: any[] = [{ text: fullPrompt }];
  
  if (previousImageBase64) {
    const base64Data = previousImageBase64.split(',')[1] || previousImageBase64;
    parts.unshift({
      inlineData: {
        data: base64Data,
        mimeType: 'image/png'
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K"
      },
      systemInstruction: SYSTEM_INSTRUCTION
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateVideo = async (
  prompt: string, 
  vibe: VibeMode = 'standard', 
  vibeOverride?: string, 
  onProgress?: (msg: string) => void,
  targetDurationSeconds: number = 5
) => {
  const ai = getAI();
  const finalPrompt = `${prompt}. Visual Style: ${getVibePrompt(vibe, vibeOverride)}`;
  
  // Use generate-preview for high-quality and extension support
  const modelToUse = 'veo-3.1-generate-preview';
  
  onProgress?.(`Forging Initial Shard (5-7s)...`);

  let operation = await ai.models.generateVideos({
    model: modelToUse,
    prompt: finalPrompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    onProgress?.("Synthesizing primary temporal lattice...");
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  let currentVideo = operation.response?.generatedVideos?.[0]?.video;
  let currentDuration = 5; // Start with the first 5s chunk

  // Temporal Expansion Loop: Extend the video until the target duration is reached
  if (targetDurationSeconds > 5 && currentVideo) {
    const iterationsNeeded = Math.ceil((targetDurationSeconds - 5) / 7);
    let currentIteration = 1;

    while (currentDuration < targetDurationSeconds) {
      onProgress?.(`Temporal Forge Iteration ${currentIteration}/${iterationsNeeded}: Syncing ${currentDuration}s/${targetDurationSeconds}s...`);
      
      let extensionOp = await ai.models.generateVideos({
        model: 'veo-3.1-generate-preview',
        prompt: `Progress the story and scene: ${finalPrompt}. Maintain high visual continuity.`,
        video: currentVideo,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!extensionOp.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        extensionOp = await ai.operations.getVideosOperation({ operation: extensionOp });
      }

      currentVideo = extensionOp.response?.generatedVideos?.[0]?.video;
      currentDuration += 7; // Veo extensions add 7 seconds
      currentIteration++;
    }
  }

  const downloadLink = currentVideo?.uri;
  if (!downloadLink) throw new Error("HumanEdge Fusion Interrupted.");

  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const generateAudio = async (text: string, vibe: VibeMode = 'standard', vibeOverride?: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Aesthetic Style: ${vibe.toUpperCase()}. Instruction: ${getVibePrompt(vibe, vibeOverride)}. Output Audio for text: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return null;
  return `data:audio/wav;base64,${base64Audio}`; 
};

export const generateCodeSolution = async (problem: string, vibe: VibeMode = 'standard', vibeOverride?: string) => {
  const ai = getAI();
  const vibeInstruction = getVibePrompt(vibe, vibeOverride);
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Task: Build a fully functional, high-fidelity web product for: ${problem}.
    Vibe Context: ${vibeInstruction}.
    Output Format: Provide a single, self-contained HTML file using Tailwind CSS via CDN and vanilla JavaScript. 
    It must be ready to render in an iframe. No markdown blocks, just the HTML content.`,
    config: {
      systemInstruction: "You are the HumanEdge Materializer. Output high-integrity, production-ready code as a single manifest. No yapping, just the HTML.",
    },
  });
  return response.text;
};

export const searchRealTimeDataset = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateGeospatialData = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: query,
    config: {
      tools: [{ googleMaps: {} }],
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const refineCode = async (existingCode: string, tweak: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Refine the following code based on the instructions: ${tweak}\n\nExisting Code:\n${existingCode}`,
    config: {
      systemInstruction: "You are the HumanEdge Integrity Engineer. Refine the provided code with high precision.",
    },
  });
  return response.text;
};

export const generateGameConcept = async (genre: string, previousConcept?: any, tweak?: string) => {
  const ai = getAI();
  const prompt = previousConcept 
    ? `Refine concept: ${tweak}\n\nPrevious: ${JSON.stringify(previousConcept)}`
    : `Generate world-class ${genre} game architecture.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are the HumanEdge World Architect. Output JSON with fields: title, story, visualStyle, mechanics.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          story: { type: Type.STRING },
          visualStyle: { type: Type.STRING },
          mechanics: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "story", "visualStyle", "mechanics"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const detectFraud = async (data: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Audit stream: ${data}`,
    config: {
      systemInstruction: "Strict Integrity Sentinel mode. Block all deceptive signals.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          findings: { type: Type.ARRAY, items: { type: Type.STRING } },
          integrityStatus: { type: Type.STRING },
          remediation: { type: Type.STRING }
        },
        required: ["riskScore", "findings", "integrityStatus"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
