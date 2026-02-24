
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function verifyTaskPhoto(taskTitle: string, taskDescription: string, base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image.split(',')[1] || base64Image,
              },
            },
            {
              text: `Analise esta foto para o checklist operacional. 
              Tarefa: "${taskTitle}"
              Descrição: "${taskDescription}"
              
              Verifique se a foto realmente comprova que a tarefa foi realizada corretamente.
              Responda em formato JSON com dois campos: 
              "approved" (boolean) e "feedback" (string curta justificando).`
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            approved: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["approved", "feedback"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"approved": false, "feedback": "Erro na análise"}');
    return result;
  } catch (error) {
    console.error("Gemini Verification Error:", error);
    return { approved: false, feedback: "Não foi possível verificar a imagem no momento." };
  }
}
