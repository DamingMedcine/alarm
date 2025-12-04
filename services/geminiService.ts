import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an encouraging message for a child before starting a task.
 */
export const getEncouragement = async (taskName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `你是一个活泼可爱、充满正能量的AI学习助手，名叫“番茄小超人”。
      你的任务是鼓励一位小学生开始做作业。
      
      现在的任务是：${taskName}。
      
      请用充满童趣、简短（50字以内）、幽默的语言鼓励他/她开始专注。可以使用emoji。
      语气要像好朋友一样。不要说教。`,
    });
    return response.text || "加油！你可以做到的！💪";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "准备好了吗？让我们一起打败作业怪兽吧！🚀";
  }
};

/**
 * Generates a fun fact or joke during the break.
 */
export const getBreakContent = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `你是一个博学的AI好朋友。
      现在是休息时间（5分钟）。
      请给小学生讲一个非常简短（50字以内）的冷笑话，或者一个令人惊讶的动物/科学冷知识。
      目的是让他/她放松一下。
      请用“你知道吗？”或者“休息一下听个笑话：”开头。`,
    });
    return response.text || "休息一下，喝口水，眺望远方！🌳";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "休息是为了一会儿飞得更高！✨";
  }
};