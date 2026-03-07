import { GoogleGenAI } from "@google/genai";
import { KnowledgeItem, Area, Resource } from '../types';

// Initialize the Gemini Client
// IMPORTANT: The API key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askSecondBrain = async (
  query: string,
  context: { items: KnowledgeItem[]; areas: Area[]; resources: Resource[] }
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    // Convert items to a text format for context
    const knowledgeBaseContext = context.items.map(item => `
    [ID: ${item.id}]
    TIPO: ${item.isProject ? 'PROJETO' : 'NOTA/INFORMAÇÃO'}
    TÍTULO: ${item.title}
    ÁREA: ${context.areas.find(a => a.id === item.areaId)?.title || 'Inbox'}
    CONTEÚDO: ${item.content}
    STATUS: ${item.status || 'N/A'}
    PRAZO: ${item.deadline || 'N/A'}
    TAREFAS: ${item.tasks?.map(t => `${t.completed ? '[X]' : '[ ]'} ${t.title}`).join(', ') || 'Nenhuma'}
    `).join('\n---\n');

    // Prepare strict context for the AI (Grounding)
    const systemInstruction = `
      Você é o "BrainOS", o núcleo de inteligência do Segundo Cérebro do usuário.
      
      SUA MISSÃO:
      Ajudar o usuário a gerenciar sua vida, projetos e conhecimentos usando o método PARA.
      Responda perguntas baseando-se PRIORITARIAMENTE nas informações fornecidas no contexto abaixo.
      
      REGRAS DE OURO:
      1. Se a informação estiver no contexto, cite-a e indique o título da nota/projeto.
      2. Se a informação NÃO estiver no contexto, você pode usar seu conhecimento geral para sugerir caminhos, mas SEMPRE deixe claro que essa informação não estava nas notas dele.
      3. Seja proativo: Se o usuário perguntar sobre um projeto, sugira os próximos passos ou aponte riscos baseados no que você leu.
      4. Mantenha um tom profissional, organizado e encorajador.

      CONTEXTO DO SEGUNDO CÉREBRO:
      ${knowledgeBaseContext}
      
      Áreas de Vida: ${context.areas.map(a => a.title).join(', ')}.
      Recursos Disponíveis: ${context.resources.map(r => r.title).join(', ')}.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "Não consegui processar a resposta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao acessar o banco de dados neural. Tente novamente.";
  }
};
