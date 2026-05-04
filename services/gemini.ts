import { KnowledgeItem, Area, Resource } from '../types';

export const askSecondBrain = async (
  query: string,
  context: { items: KnowledgeItem[]; areas: Area[]; resources: Resource[] }
): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, context }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Falha ao se comunicar com o servidor.');
    }

    const data = await response.json();
    return data.answer || "Não consegui processar a resposta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao acessar o banco de dados neural. Tente novamente.";
  }
};
